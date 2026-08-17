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
  fit?: "cover" | "contain";
}) {
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
