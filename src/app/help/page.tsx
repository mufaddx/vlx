import { PublicShell } from "@/components/public-shell";
import { HelpCenter } from "@/components/help-center";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center",
  description: "VIDLIX help: account, Random Video, Live, Dating, chat, billing, and safety.",
};

export default function HelpPage() {
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-deep dark:text-teal">Support</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold">Help Center</h1>
        <p className="mt-4 text-mist-500 dark:text-mist-400">
          Login uses email OTP only. No password. No mobile OTP. Still stuck?{" "}
          <Link href="/contact" className="underline">
            Contact us
          </Link>
          .
        </p>
        <div className="mt-10">
          <HelpCenter />
        </div>
      </article>
    </PublicShell>
  );
}
