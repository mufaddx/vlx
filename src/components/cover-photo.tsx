import Image from "next/image";

export function CoverPhoto({
  src,
  alt,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain" | "natural";
}) {
  if (fit === "natural") {
    return (
      <Image
        src={src}
        alt={alt}
        width={1080}
        height={1350}
        className={`h-auto w-full ${className}`}
        sizes={sizes}
        priority={priority}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`${fit === "contain" ? "object-contain object-center" : "object-cover object-center"} ${className}`}
      sizes={sizes}
      priority={priority}
    />
  );
}
