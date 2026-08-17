import { LandingNav } from "@/components/landing-nav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-30 min-h-screen bg-[#F4F6FA] dark:bg-ink-950">
      <LandingNav />
      <div className="pt-20">{children}</div>
    </div>
  );
}
