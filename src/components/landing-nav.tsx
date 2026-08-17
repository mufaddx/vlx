"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#random", label: "Random Video" },
  { href: "#live", label: "Live" },
  { href: "#dating", label: "Dating" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#safety", label: "Safety" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-mist-200/80 bg-white/80 px-3 py-2 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-ink-800/80">
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
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-mist-200 bg-white p-3 shadow-glass dark:border-white/10 dark:bg-ink-800 lg:hidden">
          <div className="grid">
            {links
              .filter((l) => l.label !== "How It Works")
              .map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium hover:bg-mist-100 dark:hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
            <Link href="/login" className="rounded-lg px-3 py-3 text-base font-medium" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/signup" className="btn-primary mt-2 w-full" onClick={() => setOpen(false)}>
              Sign Up
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
