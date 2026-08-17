import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.creatorEarning.findMany({ include: { user: true } });
  return <SimpleTable title="Creator earnings" columns={["user", "cents"]} rows={rows.map((r) => [r.user.username, r.balanceCents])} />;
}
