import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.liveStream.findMany({ take: 50, orderBy: { createdAt: "desc" }, include: { host: true } });
  return (
    <SimpleTable
      title="Live"
      columns={["title", "host", "status", "viewers"]}
      rows={rows.map((r) => [r.title, r.host.username, r.status, r.viewerCount])}
    />
  );
}
