import { AuthFlow } from "@/components/auth-flow";
import { PublicShell } from "@/components/public-shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="flex justify-center px-6 py-16">
        <AuthFlow mode="login" />
      </main>
    </PublicShell>
  );
}
