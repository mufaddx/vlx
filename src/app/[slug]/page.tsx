import { prisma } from "@/lib/db";
import { LandingNav } from "@/components/landing-nav";
import { SiteFooter } from "@/components/site-footer";
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
  "contact",
  "help",
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
  const page = await prisma.cmsPage.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: page?.seoTitle ?? page?.title ?? slug,
    description: page?.seoDescription ?? page?.excerpt,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function CmsRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.includes(slug as (typeof slugs)[number])) notFound();
  const page = await prisma.cmsPage.findUnique({ where: { slug } }).catch(() => null);
  const title = page?.title ?? slug.replace(/-/g, " ");
  const body =
    page?.body ??
    "This page is managed from the Admin CMS. Seed the database to load the full legal copy.";
  return (
    <div>
      <LandingNav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-heading text-4xl font-semibold capitalize">{title}</h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-mist-500 dark:text-mist-400">
          {body.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
