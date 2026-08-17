import type { FaqItem, SubscriptionPlan } from "@prisma/client";

export const FALLBACK_PLANS = [
  { id: "f", slug: "free", name: "Free", priceCents: 0, durationDays: 30, maxSponsoredUsers: 0, chatAccess: false, videoCallAccess: false, usernameVisibility: false, highlight: false },
  { id: "b", slug: "basic", name: "Basic", priceCents: 499, durationDays: 30, maxSponsoredUsers: 2, chatAccess: true, videoCallAccess: false, usernameVisibility: true, highlight: false },
  { id: "p", slug: "plus", name: "Plus", priceCents: 799, durationDays: 30, maxSponsoredUsers: 3, chatAccess: true, videoCallAccess: true, usernameVisibility: true, highlight: false },
  { id: "r", slug: "pro", name: "Pro", priceCents: 1299, durationDays: 30, maxSponsoredUsers: 5, chatAccess: true, videoCallAccess: true, usernameVisibility: true, highlight: true },
  { id: "m", slug: "max", name: "Max", priceCents: 1999, durationDays: 30, maxSponsoredUsers: 10, chatAccess: true, videoCallAccess: true, usernameVisibility: true, highlight: true },
] as unknown as SubscriptionPlan[];

export const FALLBACK_FAQS = [
  ["What is VIDLIX?", "A privacy-focused web platform for random video, live, optional dating, and private connections."],
  ["How does Random Video work?", "You match with another available person in a 50/50 video layout. Identity stays hidden."],
  ["Is Random Video recorded?", "No. Video and audio are not stored. Only operational metadata is kept."],
  ["Can I hide my profile?", "Yes. Privacy controls cover visibility, follow, message, call, dating, and online status."],
  ["How does Dating work?", "Optional. Create a Dating Profile later if you want. Like, Pass, Match, Chat."],
  ["What is Live?", "Watch, chat, request to join, and participate. Hosts moderate the room."],
  ["How many people can join a Live video?", "Up to 10 active video participants, plus additional viewers."],
  ["How does Follow work?", "Send a request with limited identity. Accept creates a connection."],
  ["What is a Sponsored Connection?", "A premium user activates premium connection access for someone else. They keep their own plan."],
  ["How do subscriptions work?", "Admin defines plans, prices, slots, and entitlements."],
  ["How do I report someone?", "Use Report in-call, in live, in chat, or on a profile."],
  ["How do I block someone?", "Use Block. Blocked people cannot match or contact you."],
  ["How do I delete my account?", "Settings → Delete Account."],
].map((q, i) => ({
  id: `faq-${i}`,
  question: q[0],
  answer: q[1],
  sortOrder: i,
  published: true,
  updatedAt: new Date(),
})) as FaqItem[];
