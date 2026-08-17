import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VIDLIX",
    short_name: "VIDLIX",
    description: "Meet. Connect. Discover. Privacy-first social video.",
    start_url: "/",
    display: "standalone",
    background_color: "#070A12",
    theme_color: "#070A12",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
