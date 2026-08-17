import Link from "next/link";
import { Logo } from "./logo";

const cols = [
  {
    title: "Product",
    links: [
      ["/#random", "Random Video"],
      ["/#live", "Live"],
      ["/#dating", "Dating"],
      ["/#chat", "Chat"],
      ["/#pricing", "Pricing"],
    ],
  },
  {
    title: "Safety",
    links: [
      ["/safety", "Safety Center"],
      ["/community-guidelines", "Guidelines"],
      ["/contact", "Report abuse"],
      ["/help", "Block & report"],
      ["/#privacy", "Privacy first"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/", "Home"],
      ["/about", "About"],
      ["/contact", "Contact"],
      ["/careers", "Careers"],
      ["/help", "Help Center"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/terms", "Terms"],
      ["/privacy", "Privacy Policy"],
      ["/cookie-policy", "Cookie Policy"],
      ["/refund-policy", "Refund Policy"],
      ["/subscription-policy", "Subscriptions"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-mist-200 dark:border-white/10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-500 dark:text-mist-400">
            VIDLIX is a privacy-first social platform for random video, live, optional dating, and
            private connections.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold">{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map(([href, label]) => (
                <li key={`${href}-${label}`}>
                  <Link
                    href={href}
                    className="text-sm text-mist-500 hover:text-ink-900 dark:text-mist-400 dark:hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-mist-200 px-6 py-6 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-mist-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© VIDLIX · All Rights Reserved.</p>
          <p>Web only · 18+ · Email OTP only</p>
        </div>
      </div>
    </footer>
  );
}
