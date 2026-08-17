"use client";

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
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-mist-200 bg-white px-3 shadow-sm dark:border-white/10 dark:bg-ink-950 sm:h-16 sm:px-5">
          <Logo />
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-2.5 py-1.5 text-sm font-medium text-mist-500 hover:bg-mist-100 hover:text-ink-900 dark:text-mist-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <a href="/login" className="btn-ghost">
              Login
            </a>
            <a href="/signup" className="btn-secondary">
              Sign Up
            </a>
            <a href="/signup" className="btn-primary">
              Start Connecting
            </a>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full hover:bg-mist-100 dark:hover:bg-white/10"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-50 flex flex-col bg-white lg:hidden dark:bg-ink-950">
          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-mist-200 px-2 py-3.5 text-base font-medium dark:border-white/10"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="border-t border-mist-200 p-4 dark:border-white/10">
            <a href="/login" className="btn-secondary w-full" onClick={() => setOpen(false)}>
              Login
            </a>
            <a href="/signup" className="btn-primary mt-3 w-full" onClick={() => setOpen(false)}>
              Sign Up
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
