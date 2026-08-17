import { prisma } from "@/lib/db";
import { PublicShell } from "@/components/public-shell";
import { getCmsFallback } from "@/lib/cms-fallback";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const slugs = [
  "terms",
  "privacy",
  "cookie-policy",
  "refund-policy",
  "subscription-policy",
  "community-guidelines",
  "safety",
  "about",
] as const;

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fallback = getCmsFallback(slug);
  const page = await prisma.cmsPage.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: page?.seoTitle ?? page?.title ?? fallback.title,
    description: page?.seoDescription ?? page?.excerpt ?? fallback.excerpt,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function CmsRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.includes(slug as (typeof slugs)[number])) notFound();
  const fallback = getCmsFallback(slug);
  const page = await prisma.cmsPage.findUnique({ where: { slug } }).catch(() => null);
  const title = page?.title ?? fallback.title;
  const body = page?.body ?? fallback.body;
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-heading text-4xl font-semibold">{title}</h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-mist-500 dark:text-mist-400">
          {body.split("\n").map((p, i) => (p.trim() ? <p key={i}>{p}</p> : null))}
        </div>
      </article>
    </PublicShell>
  );
}
