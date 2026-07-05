import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  calculateChecksum,
  PHONEPE_API_URL,
  PHONEPE_MERCHANT_ID,
} from "@/lib/phonepe";

interface CheckoutItem {
  variantId: string;
  quantity: number;
  price: number;
}

interface PaymentRequestBody {
  userId?: string | null;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  items?: CheckoutItem[];
  totalAmount?: number;
  shippingAddress?: Record<string, string>;
  paymentMethod?: "PHONEPE" | "COD";
}

interface PhonePePayResponse {
  success?: boolean;
  data?: {
    instrumentResponse?: {
      redirectInfo?: {
        url?: string;
      };
    };
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PaymentRequestBody;
    const {
      userId,
      guestInfo,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
    }

    // 1. Create order in Database (with PENDING status)
    const order = await db.order.create({
      data: {
        userId: userId || null,
        guestName: guestInfo?.name || null,
        guestEmail: guestInfo?.email || null,
        guestPhone: guestInfo?.phone || null,
        status: paymentMethod === "COD" ? "PLACED" : "PENDING",
        paymentMethod: paymentMethod, // PHONEPE or COD
        paymentStatus: "PENDING",
        totalAmount: totalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        items: {
          create: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 2. Handle Cash on Delivery (COD) path bypass
    if (paymentMethod === "COD") {
      // Deduct stock for each variant purchased
      for (const item of items) {
        await db.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        redirectUrl: `/order-success?id=${order.id}`,
      });
    }

    // 3. Handle PhonePe Checkout path
    const orderId = order.id;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const transactionId = `TXN-${orderId}-${Date.now()}`;

    // Update order with transaction id
    await db.order.update({
      where: { id: orderId },
      data: { phonepeTxnId: transactionId },
    });

    const phonepePayload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId ? `USER-${userId}` : "GUEST",
      amount: Math.round(totalAmount * 100), // convert to paise
      redirectUrl: `${baseUrl}/api/payments/phonepe/callback?id=${orderId}`,
      callbackUrl: `${baseUrl}/api/payments/phonepe/callback?id=${orderId}`,
      redirectMode: "REDIRECT",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payloadString = JSON.stringify(phonepePayload);
    const base64Payload = Buffer.from(payloadString).toString("base64");
    const checksum = calculateChecksum(base64Payload, "/pg/v1/pay");

    console.log(`Initiating PhonePe payment for order ${orderId}, Transaction: ${transactionId}`);

    // Call PhonePe Standard Checkout API
    const response = await fetch(`${PHONEPE_API_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const responseData = (await response.json()) as PhonePePayResponse;

    if (responseData.success && responseData.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        orderId: orderId,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
      });
    } else {
      console.error("PhonePe API Error:", responseData);
      return NextResponse.json({
        error: "PhonePe payment initiation failed",
        details: responseData,
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Payment Initiate Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
  }
}
