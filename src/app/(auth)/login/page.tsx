import { AuthScreen } from "@/components/auth-screen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
