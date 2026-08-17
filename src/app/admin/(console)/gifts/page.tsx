import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.gift.findMany();
  return <SimpleTable title="Gifts" columns={["name", "coins", "active"]} rows={rows.map((r) => [r.name, r.coinValue, String(r.active)])} />;
}
