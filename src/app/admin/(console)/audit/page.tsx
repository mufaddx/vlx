import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.auditLog.findMany({ take: 100, orderBy: { createdAt: "desc" } });
  return (
    <SimpleTable
      title="Audit logs"
      columns={["action", "actor", "target", "at"]}
      rows={rows.map((r) => [r.action, r.actorId.slice(0, 8), r.targetType ?? "—", r.createdAt.toISOString()])}
    />
  );
}
