export interface OtpProvider {
  send(input: {
    to: string;
    channel: "email" | "sms";
    code: string;
    purpose: string;
  }): Promise<void>;
}

export interface PaymentProvider {
  createCheckout(input: {
    userId: string;
    planId: string;
    amountCents: number;
    currency: string;
  }): Promise<{ checkoutUrl: string; providerRef: string }>;
}

export interface VideoProvider {
  createRandomRoom(sessionId: string): Promise<{ roomName: string; tokenA: string; tokenB: string }>;
  createLiveRoom(streamId: string, hostId: string): Promise<{ roomName: string; hostToken: string }>;
  participantToken?(roomName: string, identity: string, canPublish: boolean): Promise<string>;
}

export interface StorageProvider {
  put(input: {
    key: string;
    bytes: Buffer;
    mime: string;
  }): Promise<{ key: string; url: string }>;
  delete(key: string): Promise<void>;
}

export interface PayoutProvider {
  payout(input: {
    withdrawalId: string;
    amountCents: number;
  }): Promise<{ providerRef: string; status: "pending" }>;
}

export interface NotificationProvider {
  push(input: { userId: string; title: string; body: string }): Promise<void>;
}
