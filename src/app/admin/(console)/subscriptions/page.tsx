import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.subscription.findMany({ take: 50, include: { user: true, plan: true }, orderBy: { createdAt: "desc" } });
  return (
    <SimpleTable title="Subscriptions" columns={["user", "plan", "status"]} rows={rows.map((r) => [r.user.username, r.plan.name, r.status])} />
  );
}
