import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "VIDLIX — Meet. Connect. Discover.",
    template: "%s · VIDLIX",
  },
  description:
    "Connect through private random video conversations, live streams, dating and meaningful social connections — all in one privacy-focused platform.",
  applicationName: "VIDLIX",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "VIDLIX — Meet. Connect. Discover.",
    description:
      "Private random video, live, optional dating, and sponsored premium connections. Random means random.",
    type: "website",
    siteName: "VIDLIX",
    images: [{ url: "/marketing/01.png", width: 1200, height: 630, alt: "VIDLIX" }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7FB" },
    { media: "(prefers-color-scheme: dark)", color: "#070A12" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
