import { prisma } from "@/lib/db";
import { adminWithdrawalAction } from "@/lib/actions/admin";
export default async function Page() {
  const rows = await prisma.withdrawalRequest.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Withdrawals</h1>
      <ul className="mt-6 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-2xl border border-mist-200 p-3 dark:border-white/10">
            <span>@{r.user.username} · {r.amountCents}c · {r.status}</span>
            <div className="flex gap-2">
              <form action={adminWithdrawalAction.bind(null, r.id, "approved")}><button className="btn-primary" type="submit">Approve</button></form>
              <form action={adminWithdrawalAction.bind(null, r.id, "rejected")}><button className="btn-secondary" type="submit">Reject</button></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
