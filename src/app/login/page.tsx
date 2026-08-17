import { AuthFlow } from "@/components/auth-flow";
import { PublicShell } from "@/components/public-shell";
import { CoverPhoto } from "@/components/cover-photo";
import { photos } from "@/lib/marketing-photos";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="mx-auto grid max-w-7xl px-6 py-8 lg:grid-cols-2 lg:items-stretch lg:gap-10 lg:py-16">
        <div className="relative mb-8 h-48 overflow-hidden rounded-3xl sm:h-64 lg:mb-0 lg:h-auto lg:min-h-[560px]">
          <CoverPhoto src={photos.auth} alt="Sign in to VIDLIX" sizes="(max-width: 1024px) 100vw, 50vw" priority />
        </div>
        <div className="flex items-center lg:px-8">
          <AuthFlow mode="login" />
        </div>
      </main>
    </PublicShell>
  );
}
