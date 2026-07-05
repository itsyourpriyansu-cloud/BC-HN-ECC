import { NextResponse } from "next/server";
import { calculateChecksum, PHONEPE_API_URL, PHONEPE_MERCHANT_ID } from "@/lib/phonepe";

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

  return await response.json();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const txnId = searchParams.get("txnId");

    if (!txnId) {
      return NextResponse.json({ error: "Missing txnId parameter" }, { status: 400 });
    }

    console.log(`Polling transaction status for Transaction: ${txnId}`);
    const data = await getTransactionStatus(txnId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Status check route error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
