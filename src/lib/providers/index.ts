import { MockOtpProvider } from "./otp";
import { LocalStorageProvider } from "./storage";
import {
  MockNotificationProvider,
  MockPaymentProvider,
  MockPayoutProvider,
  MockVideoProvider,
} from "./mocks";
import { LiveKitVideoProvider, livekitConfigured } from "./livekit";

export const providers = {
  otp: new MockOtpProvider(),
  payment: new MockPaymentProvider(),
  video:
    process.env.VIDEO_PROVIDER === "livekit" || livekitConfigured()
      ? new LiveKitVideoProvider()
      : new MockVideoProvider(),
  storage: new LocalStorageProvider(),
  payout: new MockPayoutProvider(),
  notification: new MockNotificationProvider(),
};
