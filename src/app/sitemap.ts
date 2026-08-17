import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const paths = [
    "",
    "/terms",
    "/privacy",
    "/cookie-policy",
    "/refund-policy",
    "/subscription-policy",
    "/community-guidelines",
    "/safety",
    "/contact",
    "/help",
    "/about",
  ];
  return paths.map((path) => ({
    url: `${base}${path || "/"}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));
}
