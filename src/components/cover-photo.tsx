import Image from "next/image";

export function CoverPhoto({
  src,
  alt,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover object-center ${className}`}
      sizes={sizes}
      priority={priority}
    />
  );
}
