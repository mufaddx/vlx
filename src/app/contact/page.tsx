import { PublicShell } from "@/components/public-shell";
import { ContactForm } from "@/components/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact VIDLIX for product help or safety reports.",
};

export default function ContactPage() {
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-deep dark:text-teal">Company</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold">Contact</h1>
        <p className="mt-4 text-mist-500 dark:text-mist-400">
          Product: hello@vidlix.in · Safety: safety@vidlix.in. We do not offer phone OTP or phone support yet.
        </p>
        <ContactForm />
      </article>
    </PublicShell>
  );
}
