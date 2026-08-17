"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  Radio,
  Heart,
  Search,
  MessageCircle,
  Users,
  Bell,
  CreditCard,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { logoutAction } from "@/lib/actions/auth";

const main = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/random", label: "Random Video", icon: Video },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/dating", label: "Dating", icon: Heart },
  { href: "/search", label: "Search", icon: Search },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/connections", label: "Connections", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/earnings", label: "Earnings", icon: Sparkles },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const mobile = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/random", label: "Random", icon: Video },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/dating", label: "Dating", icon: Heart },
  { href: "/messages", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({
  firstName,
  children,
}: {
  firstName: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-mist-50 dark:bg-ink-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-mist-200 bg-white p-4 dark:border-white/10 dark:bg-ink-900 lg:flex lg:flex-col">
        <Logo />
        <nav className="mt-8 flex-1 space-y-1" aria-label="App">
          {main.map((item) => {
            const active = path === item.href || path.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
                  active
                    ? "bg-ink-900 text-white dark:bg-teal dark:text-ink-950"
                    : "text-mist-500 hover:bg-mist-100 hover:text-ink-900 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-mist-200 pt-4 dark:border-white/10">
          <Link href="/help" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm hover:bg-mist-100 dark:hover:bg-white/10">
            <HelpCircle className="h-4 w-4" /> Help & Support
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm hover:bg-mist-100 dark:hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-mist-200 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/80">
          <p className="font-heading text-sm font-medium lg:text-base">Hi, {firstName}</p>
          <ThemeToggle />
        </header>
        <main className="px-4 py-6 pb-28 lg:px-8 lg:pb-8">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-mist-200 bg-white/95 px-1 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/95 lg:hidden"
        aria-label="Mobile"
      >
        {mobile.map((item) => {
          const active = path === item.href || path.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] ${
                active ? "text-ink-900 dark:text-teal" : "text-mist-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
