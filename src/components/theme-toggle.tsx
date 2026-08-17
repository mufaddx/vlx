"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const cycle = () => {
    setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system");
  };
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  return (
    <button
      type="button"
      onClick={cycle}
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl text-mist-500 hover:bg-mist-100 hover:text-ink-900 dark:hover:bg-white/10 dark:hover:text-white"
      aria-label={`Theme: ${theme}. Click to change.`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
