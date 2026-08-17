import { LandingNav } from "@/components/landing-nav";
import { SiteFooter } from "@/components/site-footer";
import { LandingPage } from "@/components/landing-page";
import { prisma } from "@/lib/db";
import { FALLBACK_FAQS, FALLBACK_PLANS } from "@/lib/marketing-fallback";

export const revalidate = 60;
export const dynamic = "force-dynamic";

async function loadMarketing() {
  try {
    const [plans, faqs] = await Promise.all([
      prisma.subscriptionPlan.findMany({
        where: { status: "active" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.faqItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    ]);
    return {
      plans: plans.length ? plans : FALLBACK_PLANS,
      faqs: faqs.length ? faqs : FALLBACK_FAQS,
    };
  } catch {
    return { plans: FALLBACK_PLANS, faqs: FALLBACK_FAQS };
  }
}

export default async function Home() {
  const { plans, faqs } = await loadMarketing();
  return (
    <div className="min-h-screen">
      <LandingNav />
      <LandingPage plans={plans} faqs={faqs} />
      <SiteFooter />
    </div>
  );
}
