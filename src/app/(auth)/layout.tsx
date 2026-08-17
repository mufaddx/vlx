import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate z-50 min-h-screen bg-[#F4F6FA] dark:bg-ink-950">
      <header className="sticky top-0 z-50 border-b border-mist-200 bg-[#F4F6FA] px-4 py-3 dark:border-white/10 dark:bg-ink-950">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Logo prefetch={false} />
          <ThemeToggle />
        </div>
      </header>
      {children}
    </div>
  );
}
