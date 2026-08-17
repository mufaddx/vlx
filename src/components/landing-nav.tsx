"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#random", label: "Random Video" },
  { href: "/#live", label: "Live" },
  { href: "/#dating", label: "Dating" },
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#safety", label: "Safety" },
  { href: "/help", label: "Help" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-mist-200/80 bg-white/92 backdrop-blur-md dark:border-white/10 dark:bg-ink-950/92">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-mist-500 hover:bg-mist-100 hover:text-ink-900 dark:text-mist-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link href="/login" className="btn-ghost">
            Login
          </Link>
          <Link href="/signup" className="btn-secondary">
            Sign Up
          </Link>
          <Link href="/signup" className="btn-primary">
            Start Connecting
          </Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl hover:bg-mist-100 dark:hover:bg-white/10"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-ink-950/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 right-0 top-16 z-50 flex w-[min(20rem,100%)] flex-col overflow-y-auto border-l border-mist-200 bg-white p-6 dark:border-white/10 dark:bg-ink-950">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl hover:bg-mist-100 dark:hover:bg-white/10"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-1 text-center" aria-label="Mobile">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl px-3 py-3 text-base font-medium hover:bg-mist-100 dark:hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/login"
                className="mt-4 w-full rounded-xl px-3 py-3 text-base font-medium"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link href="/signup" className="btn-primary mt-2 w-full" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
