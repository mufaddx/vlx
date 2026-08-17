import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { goLiveAction } from "@/lib/actions/live";
import { asFormAction } from "@/lib/form-action";

export const metadata = { title: "Live", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string; go?: string }> }) {
  const me = await requireUser();
  const { tab = "now", q = "" } = await searchParams;
  const followingIds = (
    await prisma.follow.findMany({ where: { fromUserId: me.id }, select: { toUserId: true } })
  ).map((f) => f.toUserId);

  const where = {
    status: "live" as const,
    ...(q ? { OR: [{ title: { contains: q } }, { host: { username: { contains: q.toLowerCase() } } }] } : {}),
    ...(tab === "following" ? { hostId: { in: followingIds } } : {}),
  };
  const streams = await prisma.liveStream.findMany({
    where,
    include: { host: { include: { profile: true } } },
    orderBy: tab === "popular" ? { viewerCount: "desc" } : { createdAt: "desc" },
    take: 40,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-semibold">Live</h1>
        <form action={asFormAction(goLiveAction)} className="flex gap-2">
          <input name="title" className="input" placeholder="Live title" defaultValue={`${me.firstName}'s live`} />
          <input name="category" className="input max-w-32" placeholder="Category" defaultValue="talk" />
          <button className="btn-primary" type="submit">Go Live</button>
        </form>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["now", "Live Now"],
          ["popular", "Popular"],
          ["following", "Following"],
        ].map(([id, label]) => (
          <Link key={id} href={`/live?tab=${id}`} className={`rounded-full px-4 py-2 text-sm ${tab === id ? "bg-ink-900 text-white dark:bg-teal dark:text-ink-950" : "bg-mist-100 dark:bg-ink-800"}`}>
            {label}
          </Link>
        ))}
        <form>
          <input name="q" defaultValue={q} className="input" placeholder="Search lives" />
        </form>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((s) => (
          <Link key={s.id} href={`/live/${s.id}`} className="overflow-hidden rounded-3xl border border-mist-200 dark:border-white/10">
            <div className="h-36 bg-gradient-to-br from-ink-900 via-violet/40 to-teal/20" />
            <div className="p-4">
              <p className="text-xs font-semibold text-rose-500">LIVE · {s.viewerCount}</p>
              <p className="mt-1 font-heading text-lg font-semibold">{s.title}</p>
              <p className="text-sm text-mist-500">{s.host.firstName} · {s.category}</p>
              <span className="btn-secondary mt-3 inline-flex">Join</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
