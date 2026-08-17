"use client";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="font-heading text-xl font-semibold">Could not load this page.</p>
      <p className="mt-2 text-sm text-mist-500">{error.message || "Try again, or go back home."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" className="btn-primary" onClick={reset}>
          Try again
        </button>
        <a href="/" className="btn-secondary">
          Home
        </a>
      </div>
    </div>
  );
}
