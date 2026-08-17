import { AuthFlow } from "@/components/auth-flow";
import { CoverPhoto } from "@/components/cover-photo";
import { photos } from "@/lib/marketing-photos";

export function AuthScreen({
  mode,
  photoAlt,
}: {
  mode: "login" | "signup";
  photoAlt: string;
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl lg:grid lg:grid-cols-2 lg:items-stretch">
      <div className="relative hidden bg-ink-950 lg:block lg:min-h-[calc(100dvh-3.5rem)]">
        <CoverPhoto src={photos.auth} alt={photoAlt} fit="contain" sizes="50vw" priority />
      </div>
      <div className="flex w-full flex-1 items-start px-5 py-10 sm:items-center sm:px-10">
        <AuthFlow mode={mode} />
      </div>
    </main>
  );
}
