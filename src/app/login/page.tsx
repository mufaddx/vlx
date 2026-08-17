import { AuthFlow } from "@/components/auth-flow";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center px-6 py-16">
      <AuthFlow mode="login" />
    </main>
  );
}
