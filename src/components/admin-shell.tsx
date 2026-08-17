import Link from "next/link";
import { adminLogoutAction } from "@/lib/actions/admin";

const links = [
  ["Dashboard", "/admin"],
  ["Users", "/admin/users"],
  ["Random Video", "/admin/random"],
  ["Live", "/admin/live"],
  ["Dating", "/admin/dating"],
  ["Messages", "/admin/messages"],
  ["Connections", "/admin/connections"],
  ["Reports", "/admin/reports"],
  ["Subscriptions", "/admin/subscriptions"],
  ["Plans", "/admin/plans"],
  ["Payments", "/admin/payments"],
  ["Gifts", "/admin/gifts"],
  ["Earnings", "/admin/earnings"],
  ["KYC", "/admin/kyc"],
  ["Withdrawals", "/admin/withdrawals"],
  ["CMS", "/admin/cms"],
  ["Admin users", "/admin/staff"],
  ["Audit", "/admin/audit"],
  ["Settings", "/admin/settings"],
];

export function AdminShell({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist-50 dark:bg-ink-950">
      <aside className="fixed inset-y-0 left-0 hidden w-56 overflow-y-auto border-r border-mist-200 bg-white p-4 dark:border-white/10 dark:bg-ink-900 lg:block">
        <p className="font-heading text-lg font-semibold">VIDLIX Admin</p>
        <p className="text-xs text-mist-400">{name}</p>
        <nav className="mt-6 grid gap-1 text-sm">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-2 py-2 hover:bg-mist-100 dark:hover:bg-white/10">
              {label}
            </Link>
          ))}
        </nav>
        <form action={adminLogoutAction} className="mt-6">
          <button className="btn-ghost" type="submit">Logout</button>
        </form>
      </aside>
      <div className="lg:pl-56">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
