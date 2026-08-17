import { AuthFlow } from "@/components/auth-flow";

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md items-start px-5 py-12 sm:items-center sm:py-16">
      <AuthFlow mode={mode} />
    </main>
  );
}
