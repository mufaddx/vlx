import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.message.findMany({ take: 50, orderBy: { createdAt: "desc" } });
  return (
    <SimpleTable title="Messages" columns={["id", "body", "at"]} rows={rows.map((r) => [r.id.slice(0, 8), r.body.slice(0, 40), r.createdAt.toISOString()])} />
  );
}
