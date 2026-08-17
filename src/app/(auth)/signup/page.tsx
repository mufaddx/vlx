import { AuthScreen } from "@/components/auth-screen";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign up", robots: { index: false } };

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
