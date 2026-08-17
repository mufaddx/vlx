import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.videoSession.findMany({ take: 50, orderBy: { createdAt: "desc" } });
  return (
    <SimpleTable
      title="Random Video sessions"
      columns={["id", "status", "duration", "reason"]}
      rows={rows.map((r) => [r.id.slice(0, 8), r.status, r.durationSec ?? "—", r.endReason ?? "—"])}
    />
  );
}
