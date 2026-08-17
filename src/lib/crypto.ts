import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function generateOtp() {
  if (process.env.OTP_DEV_CODE && process.env.NODE_ENV !== "production") {
    return process.env.OTP_DEV_CODE;
  }
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

export function ageFromDob(dob: Date) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function maskedDisplayName(firstName: string, lastName: string) {
  const last = lastName.trim();
  if (!last) return firstName.trim();
  return `${firstName.trim()} .... ${last}`;
}
