import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
  ["What is VIDLIX?", "VIDLIX is a privacy-focused web platform for private random video conversations, live streams, optional dating, and meaningful connections — without exposing your identity during random calls."],
  ["How does Random Video work?", "Start Random Video, grant camera and microphone access, and VIDLIX matches you with another available person. You see a 50/50 video layout. You can chat, follow, skip, report, or end. Usernames stay hidden."],
  ["Is Random Video recorded?", "No. VIDLIX does not record or store random call video or audio. Only operational metadata such as session ID, start/end time, duration, and end reason is kept."],
  ["Can I hide my profile?", "Yes. Privacy controls let you set public or private visibility, who can follow, message, or call you, dating visibility, and online status. Random Video remains anonymous regardless."],
  ["How does Dating work?", "Dating is optional. A normal account is not added to Dating automatically. You can create a Dating Profile later with photos, bio, interests, preference, and intention. Like, Pass, Match, then chat."],
  ["What is Live?", "VIDLIX Live lets you watch streams, chat, send join requests, become a participant, and interact with the host. Hosts can accept, reject, mute, remove, block, and end a live."],
  ["How many people can join a Live video?", "A live can have up to 10 active video participants. Additional people can watch depending on infrastructure limits."],
  ["How does Follow work?", "During a random call you can send a Follow Request. The other person sees a limited identity such as a masked name. If they accept, a connection is created. Full username may still require a subscription."],
  ["What is a Sponsored Connection?", "A premium subscriber can use available connection slots to activate Premium Connection access for another VIDLIX user. The original subscriber keeps their own subscription. This is not a subscription transfer."],
  ["How do subscriptions work?", "Plans such as Free, Basic, Plus, Pro, and Max are defined in the Super Admin Panel. Benefits, prices, sponsored slots, and limits are admin-controlled — not hard-coded in the product."],
  ["How do I report someone?", "Use Report in a call, live, chat, profile, or dating card. Choose a reason such as harassment, spam, scam, or abuse. Moderation reviews every report."],
  ["How do I block someone?", "Use Block from a call, live, chat, or profile. Blocked users cannot match with you in Random Video and cannot contact you through the platform."],
  ["How do I delete my account?", "Go to Settings → Delete Account. You will confirm the action. This is permanent and subject to legal retention of operational records where required."],
] as const;

const legal: Array<[string, string, string]> = [
  ["terms", "Terms & Conditions", "These Terms govern your use of VIDLIX. You must be 18 or older. You agree not to record random calls, harass others, or misuse the platform. VIDLIX may suspend accounts that violate these Terms."],
  ["privacy", "Privacy Policy", "VIDLIX is built around privacy. Random video calls are not recorded. We store account data, operational session metadata, and the content you choose to share (messages, dating photos). We do not sell your identity from random matching."],
  ["cookie-policy", "Cookie Policy", "VIDLIX uses essential cookies for authentication and preference cookies for theme. Analytics cookies, if enabled by Admin, are documented here. You can control non-essential cookies."],
  ["refund-policy", "Refund Policy", "Subscription refunds are handled according to the rules configured by VIDLIX and applicable law. Contact support with your payment reference. Mock payments in development are never charged."],
  ["subscription-policy", "Subscription Policy", "Plans, prices, sponsored connection slots, and feature entitlements are defined by Super Admin. Upgrades take effect after a successful payment through the configured PaymentProvider."],
  ["community-guidelines", "Community Guidelines", "Be 18+. No harassment, sexual content involving minors, scams, or recording of private calls. Report abuse. Moderators may warn, suspend, or ban."],
  ["safety", "Safety Center", "Use anonymous random calling, block, report, and privacy controls. Never share financial details with strangers. VIDLIX does not record random calls. Visit Help if you need support."],
  ["contact", "Contact", "Email support@vidlix.com for product help. For abuse reports, use in-app Report or write to safety@vidlix.com."],
  ["help", "Help Center", "Find answers about Random Video, Live, Dating, subscriptions, sponsored connections, and account security. If you cannot sign in, use account recovery from the login screen."],
  ["about", "About VIDLIX", "VIDLIX is a web-only social technology platform for private random video, live, optional dating, and sponsored premium connections — designed so random really means random."],
];

async function main() {
  await prisma.systemSetting.upsert({
    where: { key: "free_message_limit" },
    update: {},
    create: { key: "free_message_limit", value: "10" },
  });
  await prisma.systemSetting.upsert({
    where: { key: "max_live_participants" },
    update: {},
    create: { key: "max_live_participants", value: "10" },
  });
  await prisma.systemSetting.upsert({
    where: { key: "maintenance_mode" },
    update: {},
    create: { key: "maintenance_mode", value: "false" },
  });
  await prisma.systemSetting.upsert({
    where: { key: "monetization_enabled" },
    update: {},
    create: { key: "monetization_enabled", value: "false" },
  });

  const plans = [
    { slug: "free", name: "Free", priceCents: 0, maxSponsoredUsers: 0, chatAccess: false, videoCallAccess: false, datingAccess: false, usernameVisibility: false, freeMessageLimit: 10, sortOrder: 0, highlight: false },
    { slug: "basic", name: "Basic", priceCents: 499, maxSponsoredUsers: 2, chatAccess: true, videoCallAccess: false, datingAccess: true, usernameVisibility: true, freeMessageLimit: 10, sortOrder: 1, highlight: false },
    { slug: "plus", name: "Plus", priceCents: 799, maxSponsoredUsers: 3, chatAccess: true, videoCallAccess: true, datingAccess: true, usernameVisibility: true, freeMessageLimit: 10, sortOrder: 2, highlight: false },
    { slug: "pro", name: "Pro", priceCents: 1299, maxSponsoredUsers: 5, chatAccess: true, videoCallAccess: true, datingAccess: true, usernameVisibility: true, freeMessageLimit: 10, sortOrder: 3, highlight: true },
    { slug: "max", name: "Max", priceCents: 1999, maxSponsoredUsers: 10, chatAccess: true, videoCallAccess: true, datingAccess: true, usernameVisibility: true, freeMessageLimit: 10, sortOrder: 4, highlight: false },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: { ...plan, randomVideoAccess: true, liveAccess: true, status: "active", durationDays: 30 },
    });
  }

  await prisma.faqItem.deleteMany();
  for (const [i, [question, answer]] of faqs.entries()) {
    await prisma.faqItem.create({ data: { question, answer, sortOrder: i, published: true } });
  }

  for (const [slug, title, body] of legal) {
    await prisma.cmsPage.upsert({
      where: { slug },
      update: { title, body, seoTitle: `${title} · VIDLIX`, seoDescription: body.slice(0, 155) },
      create: { slug, title, body, excerpt: body.slice(0, 140), seoTitle: `${title} · VIDLIX`, seoDescription: body.slice(0, 155) },
    });
  }

  const superPerms = [
    "*",
    "users.read",
    "users.write",
    "moderation",
    "subscriptions",
    "cms",
    "settings",
    "audit",
  ];
  const role = await prisma.role.upsert({
    where: { name: "super_admin" },
    update: {},
    create: { name: "super_admin" },
  });
  for (const key of superPerms) {
    const perm = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
      update: {},
      create: { roleId: role.id, permissionId: perm.id },
    });
  }

  const free = await prisma.subscriptionPlan.findUnique({ where: { slug: "free" } });
  const now = new Date();
  const adult = new Date("1998-04-12");
  const demos = [
    { username: "maya_rivers", email: "maya@vidlix.dev", firstName: "Maya", lastName: "Rivers", bio: "Here for unhurried conversations." },
    { username: "arjun_nair", email: "arjun@vidlix.dev", firstName: "Arjun", lastName: "Nair", bio: "Live host. Always report, never record." },
  ];
  for (const d of demos) {
    const user = await prisma.user.upsert({
      where: { username: d.username },
      update: {},
      create: {
        email: d.email,
        username: d.username,
        firstName: d.firstName,
        lastName: d.lastName,
        dateOfBirth: adult,
        gender: "prefer_not",
        emailVerifiedAt: now,
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
        guidelinesAcceptedAt: now,
        datingOptIn: "later",
        profile: { create: { bio: d.bio } },
        privacy: { create: {} },
        preferences: { create: {} },
      },
    });
    if (free) {
      const hasSub = await prisma.subscription.findFirst({ where: { userId: user.id, status: "active" } });
      if (!hasSub) {
        await prisma.subscription.create({ data: { userId: user.id, planId: free.id, status: "active" } });
      }
    }
  }

  const pro = await prisma.subscriptionPlan.findUnique({ where: { slug: "pro" } });
  const arjun = await prisma.user.findUnique({ where: { username: "arjun_nair" } });
  if (pro && arjun) {
    await prisma.subscription.updateMany({ where: { userId: arjun.id, status: "active" }, data: { status: "cancelled" } });
    await prisma.subscription.create({ data: { userId: arjun.id, planId: pro.id, status: "active" } });
  }

  const gifts = [
    { name: "Rose", coinValue: 10 },
    { name: "Star", coinValue: 50 },
    { name: "Crown", coinValue: 200 },
  ];
  for (const g of gifts) {
    const exists = await prisma.gift.findFirst({ where: { name: g.name } });
    if (!exists) await prisma.gift.create({ data: g });
  }

  await prisma.adminUser.upsert({
    where: { email: "admin@vidlix.dev" },
    update: {},
    create: {
      email: "admin@vidlix.dev",
      name: "Super Admin",
      passwordHash: createHash("sha256").update("VidlixAdmin!2026").digest("hex"),
      roleId: role.id,
    },
  });

  console.log("VIDLIX seed complete.");
  console.log("Users: maya@vidlix.dev / arjun@vidlix.dev OTP 000000");
  console.log("Admin: admin@vidlix.dev / VidlixAdmin!2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
