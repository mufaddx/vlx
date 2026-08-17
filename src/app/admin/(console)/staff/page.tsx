import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.adminUser.findMany({ include: { role: true } });
  return <SimpleTable title="Admin users" columns={["email", "role", "active"]} rows={rows.map((r) => [r.email, r.role.name, String(r.active)])} />;
}
