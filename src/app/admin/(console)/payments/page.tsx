import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.payment.findMany({ take: 50, orderBy: { createdAt: "desc" }, include: { user: true } });
  return (
    <SimpleTable title="Payments" columns={["user", "amount", "status", "provider"]} rows={rows.map((r) => [r.user.username, r.amountCents, r.status, r.provider])} />
  );
}
