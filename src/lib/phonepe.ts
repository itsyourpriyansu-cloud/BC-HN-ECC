import crypto from "crypto";

const saltKey = process.env.PHONEPE_SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

export function calculateChecksum(payloadBase64: string, endpoint: string): string {
  const rawString = payloadBase64 + endpoint + saltKey;
  const sha256 = crypto.createHash("sha256").update(rawString).digest("hex");
  return `${sha256}###${saltIndex}`;
}

export const PHONEPE_API_URL = process.env.PHONEPE_ENV === "production"
  ? "https://api.phonepe.com/apis/hermes/pg"
  : "https://api-preprod.phonepe.com/apis/pg-sandbox";

export const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT";
