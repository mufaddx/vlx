import { prisma } from "@/lib/db";
import { adminGrantPlanAction, adminSuspendUserAction } from "@/lib/actions/admin";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ username: { contains: q.toLowerCase() } }, { email: { contains: q.toLowerCase() } }] }
      : {},
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { subscriptions: { include: { plan: true }, where: { status: "active" } } },
  });
  const plans = await prisma.subscriptionPlan.findMany();
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Users</h1>
      <form className="mt-4"><input name="q" defaultValue={q} className="input" placeholder="Search username or email" /></form>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-mist-400"><th className="py-2">User</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-mist-200 dark:border-white/10">
                <td className="py-2">@{u.username}<br /><span className="text-mist-400">{u.email}</span></td>
                <td>{u.subscriptions[0]?.plan.name ?? "—"}</td>
                <td>{u.status}</td>
                <td className="space-y-1 py-2">
                  <form action={adminSuspendUserAction.bind(null, u.id, "suspended")}><button className="btn-ghost" type="submit">Suspend</button></form>
                  <form action={adminSuspendUserAction.bind(null, u.id, "banned")}><button className="btn-ghost" type="submit">Ban</button></form>
                  <form action={adminSuspendUserAction.bind(null, u.id, "active")}><button className="btn-ghost" type="submit">Unban</button></form>
                  {plans[0] ? (
                    <form action={adminGrantPlanAction.bind(null, u.id, plans.find((p) => p.slug === "pro")?.id ?? plans[0].id)}>
                      <button className="btn-ghost" type="submit">Grant Pro</button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
