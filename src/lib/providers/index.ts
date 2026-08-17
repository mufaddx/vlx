import { MockOtpProvider } from "./otp";
import { SmtpOtpProvider, smtpConfigured } from "./smtp-otp";
import { LocalStorageProvider } from "./storage";
import {
  MockNotificationProvider,
  MockPaymentProvider,
  MockPayoutProvider,
  MockVideoProvider,
} from "./mocks";
import { LiveKitVideoProvider, livekitConfigured } from "./livekit";

export const providers = {
  otp: smtpConfigured() ? new SmtpOtpProvider() : new MockOtpProvider(),
  payment: new MockPaymentProvider(),
  video:
    process.env.VIDEO_PROVIDER === "livekit" || livekitConfigured()
      ? new LiveKitVideoProvider()
      : new MockVideoProvider(),
  storage: new LocalStorageProvider(),
  payout: new MockPayoutProvider(),
  notification: new MockNotificationProvider(),
};
