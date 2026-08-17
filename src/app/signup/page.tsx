import { AuthFlow } from "@/components/auth-flow";
import { PublicShell } from "@/components/public-shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up", robots: { index: false } };

export default function SignupPage() {
  return (
    <PublicShell>
      <main className="flex justify-center px-6 py-16">
        <AuthFlow mode="signup" />
      </main>
    </PublicShell>
  );
}
