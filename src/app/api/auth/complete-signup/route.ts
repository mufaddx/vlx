import { performCompleteSignup } from "@/lib/otp-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await performCompleteSignup(formData);
  return Response.json(result);
}
