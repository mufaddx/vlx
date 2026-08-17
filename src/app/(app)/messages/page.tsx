import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { visibleIdentity } from "@/lib/social";

export const metadata = { title: "Messages", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const me = await requireUser();
  const { q = "" } = await searchParams;
  const connections = await prisma.connection.findMany({
    where: { OR: [{ userAId: me.id }, { userBId: me.id }] },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = [];
  for (const c of connections) {
    const other = c.userAId === me.id ? c.userB : c.userA;
    if (q && !other.username.includes(q.toLowerCase()) && !`${other.firstName} ${other.lastName}`.toLowerCase().includes(q.toLowerCase())) {
      continue;
    }
    const identity = await visibleIdentity({
      viewerId: me.id,
      target: other,
      connected: true,
      context: "connection",
    });
    const last = c.messages[0];
    const unread = await prisma.message.count({
      where: { connectionId: c.id, receiverId: me.id, reads: { none: { userId: me.id } } },
    });
    rows.push({ c, other, identity, last, unread });
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">Messages</h1>
      <form className="mt-4">
        <input name="q" defaultValue={q} className="input" placeholder="Search conversations" />
      </form>
      <ul className="mt-6 space-y-2">
        {rows.length === 0 ? <p className="text-sm text-mist-500">No conversations yet. Connect with someone first.</p> : null}
        {rows.map(({ c, identity, last, unread }) => (
          <li key={c.id}>
            <Link
              href={`/messages/${c.id}`}
              className="flex items-center justify-between rounded-2xl border border-mist-200 px-4 py-3 dark:border-white/10"
            >
              <div>
                <p className="font-medium">{identity.name}</p>
                <p className="text-sm text-mist-500">{last?.body ?? "No messages yet"}</p>
              </div>
              <div className="text-right text-xs text-mist-400">
                {last ? new Date(last.createdAt).toLocaleTimeString() : ""}
                {unread ? <p className="mt-1 font-semibold text-violet-deep">{unread} unread</p> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
