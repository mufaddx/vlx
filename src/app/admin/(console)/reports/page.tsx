import { prisma } from "@/lib/db";
import { adminModerationAction } from "@/lib/actions/admin";

export default async function Page() {
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" }, take: 80, include: { fromUser: true, toUser: true } });
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Reports & moderation</h1>
      <ul className="mt-6 space-y-3">
        {reports.map((r) => (
          <li key={r.id} className="rounded-2xl border border-mist-200 p-4 text-sm dark:border-white/10">
            <p>{r.targetType} · {r.reason} · {r.status}</p>
            <p className="text-mist-500">{r.details}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["dismiss", "warn", "suspend", "ban"] as const).map((a) => (
                <form key={a} action={adminModerationAction.bind(null, r.id, a)}>
                  <button className="btn-ghost capitalize" type="submit">{a}</button>
                </form>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
