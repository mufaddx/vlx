export function CoverPhoto({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain" | "natural";
}) {
  return (
    // Native img only — next/image `fill` was covering login/signup during navigation.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`relative block h-auto w-full ${className}`}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
