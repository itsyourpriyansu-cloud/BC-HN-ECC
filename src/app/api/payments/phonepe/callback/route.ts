import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  calculateChecksum,
  PHONEPE_API_URL,
  PHONEPE_MERCHANT_ID,
  verifyChecksum,
} from "@/lib/phonepe";

interface PhonePeStatusResponse {
  success?: boolean;
  code?: string;
  message?: string;
}

interface PhonePeWebhookPayload {
  code?: string;
  data?: {
    merchantTransactionId?: string;
  };
}

// Helper to query PhonePe server directly for status (prevents client spoofing)
async function getTransactionStatus(txnId: string) {
  const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${txnId}`;
  const checksum = calculateChecksum("", endpoint);

  const response = await fetch(`${PHONEPE_API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
    },
  });

  return (await response.json()) as PhonePeStatusResponse;
}

// 1. GET Request: Handles user redirection landing back on our store
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.redirect(new URL("/checkout?error=missing_order", req.url));
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || !order.phonepeTxnId) {
      return NextResponse.redirect(new URL(`/checkout?error=order_not_found`, req.url));
    }

    // If order is already completed, redirect directly to success page
    if (order.paymentStatus === "SUCCESS") {
      return NextResponse.redirect(new URL(`/order-success?id=${order.id}`, req.url));
    }

    // Call PhonePe server directly to verify status
    console.log(`Checking PhonePe transaction status for Order ${orderId}, Txn: ${order.phonepeTxnId}`);
    const statusData = await getTransactionStatus(order.phonepeTxnId);

    if (statusData.success && statusData.code === "PAYMENT_SUCCESS") {
      // Deduct stock and finalize order if not already done
      await db.$transaction(async (tx) => {
        // Double check status inside transaction
        const freshOrder = await tx.order.findUnique({ where: { id: orderId } });
        if (freshOrder?.paymentStatus !== "SUCCESS") {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "PLACED",
              paymentStatus: "SUCCESS",
            },
          });

          // Decrement stock
          for (const item of order.items) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }
      });

      return NextResponse.redirect(new URL(`/order-success?id=${orderId}`, req.url));
    } else {
      // Update order as failed
      await db.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
          paymentStatus: "FAILED",
        },
      });

      const errorMsg = statusData.message || "payment_failed";
      return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url));
    }
  } catch (error) {
    console.error("Redirect Callback Error:", error);
    return NextResponse.redirect(new URL(`/checkout?error=internal_server_error`, req.url));
  }
}

// 2. POST Request: Handles PhonePe background server-to-server webhook callbacks
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { response?: string };
    
    // Check if PhonePe sent an encrypted/base64 response payload
    if (!body.response) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const base64Response = body.response;
    // Decode base64 payload
    const decodedPayloadString = Buffer.from(base64Response, "base64").toString("utf-8");
    const payload = JSON.parse(decodedPayloadString) as PhonePeWebhookPayload;

    const transactionId = payload.data?.merchantTransactionId;
    const paymentCode = payload.code; // PAYMENT_SUCCESS, PAYMENT_ERROR

    console.log(`Received PhonePe webhook for Txn ${transactionId}, Code: ${paymentCode}`);

    // Verify webhook authenticity by recalculating checksum
    // Note: PhonePe passes checksum in X-VERIFY header of webhook
    const headerChecksum = req.headers.get("X-VERIFY") || "";
    if (!verifyChecksum(base64Response, "", headerChecksum)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
    
    if (transactionId) {
      const order = await db.order.findFirst({
        where: { phonepeTxnId: transactionId },
        include: { items: true },
      });

      if (order && order.paymentStatus !== "SUCCESS") {
        if (paymentCode === "PAYMENT_SUCCESS") {
          await db.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: "PLACED",
                paymentStatus: "SUCCESS",
              },
            });

            // Decrement stock
            for (const item of order.items) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          });
          console.log(`Successfully completed order ${order.id} via webhook.`);
        } else {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "CANCELLED",
              paymentStatus: "FAILED",
            },
          });
          console.log(`Cancelled order ${order.id} via webhook callback.`);
        }
      }
    }

    // PhonePe webhooks expect a simple JSON response confirming delivery
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Webhook callback processing error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Error processing webhook", details: message }, { status: 500 });
  }
}
