import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { markNotificationsReadAction } from "@/lib/actions/social";
import { asFormAction } from "@/lib/form-action";
import Link from "next/link";

export const metadata = { title: "Notifications", robots: { index: false } };

export default async function Page() {
  const me = await requireUser();
  const items = await prisma.notification.findMany({
    where: { userId: me.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-semibold">Notifications</h1>
        <form action={asFormAction(markNotificationsReadAction)}>
          <button className="btn-ghost" type="submit">
            Mark read
          </button>
        </form>
      </div>
      <ul className="mt-6 space-y-2">
        {items.length === 0 ? <p className="text-sm text-mist-500">No notifications yet.</p> : null}
        {items.map((n) => (
          <li key={n.id}>
            <Link
              href={n.href || "/notifications"}
              className={`block rounded-2xl border px-4 py-3 ${
                n.readAt
                  ? "border-mist-200 dark:border-white/10"
                  : "border-violet/40 bg-violet/5"
              }`}
            >
              <p className="text-xs uppercase tracking-widest text-mist-400">{n.type.replace(/_/g, " ")}</p>
              <p className="mt-1 font-medium">{n.title}</p>
              <p className="text-sm text-mist-500">{n.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
