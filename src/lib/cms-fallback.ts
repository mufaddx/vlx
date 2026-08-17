export type CmsFallback = {
  title: string;
  excerpt: string;
  body: string;
};

export const CMS_FALLBACK: Record<string, CmsFallback> = {
  terms: {
    title: "Terms & Conditions",
    excerpt: "Rules for using VIDLIX. You must be 18 or older.",
    body: `These Terms govern your use of VIDLIX at vidlix.in.

You must be 18 or older. There is no face scan. Date of birth is how we enforce age.

VIDLIX is web-only. Random Video is anonymous: we do not show username, email, or phone during a random match. You must not record, screenshot for harassment, or stream a random call elsewhere.

You agree not to harass, scam, spam, or impersonate others. We may warn, suspend, or ban accounts that break these Terms or our Community Guidelines.

Subscriptions, sponsored connections, and entitlements are defined in Admin. Paid checkout only works when a PaymentProvider is configured. Mock checkout never takes real money.

We may update these Terms. Continued use after a notice on this page means you accept the update.

Contact: hello@vidlix.in`,
  },
  privacy: {
    title: "Privacy Policy",
    excerpt: "What we store, what we do not record, and how Random Video stays private.",
    body: `VIDLIX is built around privacy.

Random Video: we do not record or store call video or audio. We keep operational metadata such as session id, start and end time, duration, and end reason.

Account: we store the email you use to sign in, profile fields you choose, messages you send, dating photos you upload, reports, and subscription records.

We do not sell random-match identity. Usernames on Random Video stay hidden.

Cookies: essential session cookie for login, and a theme preference. We do not run third-party ads on the product surface.

You can hide your profile, control who can follow, message, or call you, and delete your account from Settings.

Contact: hello@vidlix.in`,
  },
  "cookie-policy": {
    title: "Cookie Policy",
    excerpt: "Essential login cookies and optional theme preference.",
    body: `VIDLIX uses a small set of cookies.

Essential: an httpOnly session cookie so you stay logged in. Without it, the app cannot authenticate you.

Preference: theme (light, dark, or system) stored in the browser.

We do not use advertising cookies. If analytics is enabled later by Admin, this page will be updated.

You can clear cookies in your browser. That will log you out.`,
  },
  "refund-policy": {
    title: "Refund Policy",
    excerpt: "How subscription refunds are handled.",
    body: `Plans and prices are set in the VIDLIX Admin panel.

If a real PaymentProvider is connected and you were charged in error, email hello@vidlix.in with the payment reference. Refunds follow applicable law and the rules configured by VIDLIX.

Development and mock checkout never collect card details and never create a real charge.

Sponsored Premium Connection is not a transfer of your subscription. Refunds do not move a plan from one account to another.`,
  },
  "subscription-policy": {
    title: "Subscription Policy",
    excerpt: "Plans, entitlements, and sponsored connections.",
    body: `VIDLIX plans (Free, Basic, Plus, Pro, Max and any others Admin adds) control chat, private video, dating, live, username visibility, free message limits, and sponsored connection slots.

Nothing important is permanently hard-coded. Super Admin can change entitlements.

A sponsored connection lets a premium member activate premium connection access for someone else. The sponsor keeps their own plan. This is not a gift of the whole subscription.

Upgrades apply after a successful payment through the configured PaymentProvider.`,
  },
  "community-guidelines": {
    title: "Community Guidelines",
    excerpt: "Be 18+. No harassment. No recording private calls.",
    body: `Be 18 or older.

Do not harass, threaten, scam, or sexually exploit anyone. Do not share sexual content involving minors — that is illegal and we will report it.

Do not record Random Video or private calls.

Use Report and Block. Moderators may warn, suspend, or ban.

Dating is optional. Nobody is auto-enrolled.

Live rooms: hosts moderate. Maximum 10 people on video at once.`,
  },
  safety: {
    title: "Safety Center",
    excerpt: "Block, report, privacy controls, and what we never record.",
    body: `Random Video is anonymous. Do not share bank details, OTPs, or your home address with a stranger.

Block: they cannot match with you again or contact you.

Report: available in call, live, chat, profile, and dating. Choose a reason. Safety reviews reports.

Privacy settings: public or private profile, who can follow, message, or call, dating visibility, online status.

VIDLIX does not record Random Video.

If you are in immediate danger, contact local emergency services. Then email safety@vidlix.in`,
  },
  contact: {
    title: "Contact",
    excerpt: "Product help and safety reports.",
    body: `Product and account: hello@vidlix.in

Safety and abuse: safety@vidlix.in

You can also use Report inside the app after you log in.

We reply by email. There is no phone support yet.`,
  },
  help: {
    title: "Help Center",
    excerpt: "Account, Random Video, Live, Dating, chat, and billing.",
    body: `Use the Help Center categories for step-by-step answers. If you cannot sign in, request a new email OTP from the login page. VIDLIX does not use passwords or mobile OTP.`,
  },
  about: {
    title: "About VIDLIX",
    excerpt: "Web-only social video with privacy-first random matching.",
    body: `VIDLIX is a web-only social platform: Random Video, Live, optional Dating, chat, and subscriptions.

Random means random. During a match we hide username, email, and phone. We do not record the call.

Dating is opt-in. A normal account is not added to Dating automatically.

Live allows up to 10 people on video, plus viewers.

We are based around vidlix.in. Careers, if any, are listed on the Careers page.`,
  },
  careers: {
    title: "Careers",
    excerpt: "No open roles right now.",
    body: `VIDLIX is not listing public job openings at the moment.

If you want to be considered later, email hello@vidlix.in with a short note. Do not send sensitive documents unprompted.`,
  },
};

export function getCmsFallback(slug: string): CmsFallback {
  return (
    CMS_FALLBACK[slug] ?? {
      title: slug.replace(/-/g, " "),
      excerpt: "VIDLIX",
      body: "This page is not available yet.",
    }
  );
}
