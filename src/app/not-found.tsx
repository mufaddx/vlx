import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="text-sm text-mist-400">404</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">This page is not on VIDLIX</h1>
        <Link href="/" className="btn-primary mt-6">
          Back to landing
        </Link>
      </div>
    </main>
  );
}
