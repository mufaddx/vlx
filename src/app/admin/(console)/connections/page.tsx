import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.connection.findMany({ take: 50, include: { userA: true, userB: true } });
  return (
    <SimpleTable title="Connections" columns={["a", "b"]} rows={rows.map((r) => [r.userA.username, r.userB.username])} />
  );
}
