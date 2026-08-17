import { AuthFlow } from "@/components/auth-flow";
import { CoverPhoto } from "@/components/cover-photo";
import { photos } from "@/lib/marketing-photos";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up", robots: { index: false } };

export default function SignupPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100dvh-3.5rem)] max-w-6xl lg:grid-cols-2 lg:items-stretch">
      <div className="relative aspect-[9/16] bg-mist-100 dark:bg-ink-900 sm:aspect-[4/5] lg:aspect-auto lg:min-h-[calc(100dvh-3.5rem)]">
        <CoverPhoto src={photos.auth} alt="Create a VIDLIX account" fit="contain" sizes="(max-width: 1024px) 100vw, 50vw" priority />
      </div>
      <div className="flex items-center px-5 py-8 sm:px-10">
        <AuthFlow mode="signup" />
      </div>
    </main>
  );
}
