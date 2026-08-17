import { prisma } from "@/lib/db";
import { SimpleTable } from "@/components/simple-table";
export default async function Page() {
  const rows = await prisma.datingProfile.findMany({ take: 50, include: { user: true } });
  return (
    <SimpleTable title="Dating" columns={["user", "active", "location"]} rows={rows.map((r) => [r.user.username, String(r.active), r.locationLabel])} />
  );
}
