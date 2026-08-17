import { AuthFlow } from "@/components/auth-flow";
import { AuthShell } from "@/components/auth-shell";
import { CoverPhoto } from "@/components/cover-photo";
import { photos } from "@/lib/marketing-photos";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthShell>
      <main className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 pb-10 sm:px-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
        <div className="relative mb-8 h-40 overflow-hidden rounded-3xl sm:h-52 lg:mb-0 lg:h-auto lg:min-h-[480px]">
          <CoverPhoto src={photos.auth} alt="Sign in to VIDLIX" sizes="(max-width: 1024px) 100vw, 50vw" priority />
        </div>
        <div className="flex items-center lg:px-8">
          <AuthFlow mode="login" />
        </div>
      </main>
    </AuthShell>
  );
}
