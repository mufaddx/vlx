import { LandingNav } from "@/components/landing-nav";
import { SiteFooter } from "@/components/site-footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <div className="pt-16">{children}</div>
      <SiteFooter />
    </div>
  );
}
