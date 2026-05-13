import crypto from "crypto";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(code: string) {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET!)
    .update(code)
    .digest("hex");
}
