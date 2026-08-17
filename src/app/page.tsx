import { PublicShell } from "@/components/public-shell";
import { LandingPage } from "@/components/landing-page";
import { prisma } from "@/lib/db";
import { FALLBACK_FAQS } from "@/lib/marketing-fallback";

export const revalidate = 60;
export const dynamic = "force-dynamic";

async function loadFaqs() {
  try {
    const faqs = await prisma.faqItem.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    return faqs.length ? faqs : FALLBACK_FAQS;
  } catch {
    return FALLBACK_FAQS;
  }
}

export default async function Home() {
  const faqs = await loadFaqs();
  return (
    <PublicShell>
      <LandingPage faqs={faqs} />
    </PublicShell>
  );
}
