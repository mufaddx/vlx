import { prisma } from "@/lib/db";
import { adminSaveCmsAction, adminSaveFaqAction } from "@/lib/actions/admin";

export default async function Page() {
  const pages = await prisma.cmsPage.findMany({ orderBy: { slug: "asc" } });
  const faqs = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">CMS</h1>
      <div className="mt-6 space-y-6">
        {pages.map((p) => (
          <form key={p.id} action={adminSaveCmsAction} className="space-y-2 rounded-2xl border border-mist-200 p-4 dark:border-white/10">
            <input type="hidden" name="slug" value={p.slug} />
            <input name="title" className="input" defaultValue={p.title} />
            <textarea name="body" className="input min-h-32 py-3" defaultValue={p.body} />
            <button className="btn-primary" type="submit">Save {p.slug}</button>
          </form>
        ))}
      </div>
      <h2 className="mt-10 font-heading text-2xl">FAQs</h2>
      {faqs.map((f) => (
        <form key={f.id} action={adminSaveFaqAction} className="mt-4 space-y-2">
          <input type="hidden" name="id" value={f.id} />
          <input name="question" className="input" defaultValue={f.question} />
          <textarea name="answer" className="input min-h-20 py-3" defaultValue={f.answer} />
          <button className="btn-secondary" type="submit">Save FAQ</button>
        </form>
      ))}
    </div>
  );
}
