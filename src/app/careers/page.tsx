import { PublicShell } from "@/components/public-shell";
import { getCmsFallback } from "@/lib/cms-fallback";
import type { Metadata } from "next";

const page = getCmsFallback("careers");

export const metadata: Metadata = {
  title: page.title,
  description: page.excerpt,
};

export default function CareersPage() {
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-heading text-4xl font-semibold">{page.title}</h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-mist-500 dark:text-mist-400">
          {page.body.split("\n\n").map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </article>
    </PublicShell>
  );
}
