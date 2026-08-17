import { performSendOtp } from "@/lib/otp-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await performSendOtp(formData);
  return Response.json(result);
}
