import { LandingNav } from "@/components/landing-nav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <div className="pt-20">{children}</div>
    </div>
  );
}
