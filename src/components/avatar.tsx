export function Avatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-10 w-10 text-sm" : size === "lg" ? "h-24 w-24 text-2xl" : "h-14 w-14 text-lg";
  const initial = name.trim().charAt(0).toUpperCase() || "V";
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={`${dim} rounded-full object-cover`} />
    );
  }
  return (
    <span
      className={`${dim} grid place-items-center rounded-full bg-gradient-to-br from-teal to-violet font-heading font-semibold text-ink-950`}
    >
      {initial}
    </span>
  );
}
