import { LandingNav } from "@/components/landing-nav";
import { SiteFooter } from "@/components/site-footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      {children}
      <SiteFooter />
    </div>
  );
}
