import { prisma } from "@/lib/db";
import { adminKycAction } from "@/lib/actions/admin";
export default async function Page() {
  const rows = await prisma.kycProfile.findMany({ include: { user: true } });
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">KYC</h1>
      <ul className="mt-6 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-2xl border border-mist-200 p-3 dark:border-white/10">
            <span>@{r.user.username} · {r.status}</span>
            <div className="flex gap-2">
              <form action={adminKycAction.bind(null, r.userId, "approved")}><button className="btn-primary" type="submit">Approve</button></form>
              <form action={adminKycAction.bind(null, r.userId, "rejected")}><button className="btn-secondary" type="submit">Reject</button></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
