import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-violet shadow-lift">
        <span className="h-3 w-3 rounded-full bg-ink-950" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">VIDLIX</span>
    </Link>
  );
}
