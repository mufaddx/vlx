import { performVerifyOtp } from "@/lib/otp-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await performVerifyOtp(formData);
  return Response.json(result);
}
