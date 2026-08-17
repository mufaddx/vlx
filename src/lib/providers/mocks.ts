import type {
  NotificationProvider,
  PaymentProvider,
  PayoutProvider,
  VideoProvider,
} from "./types";

export class MockPaymentProvider implements PaymentProvider {
  async createCheckout() {
    throw new Error(
      "Payments are not connected. Configure PaymentProvider credentials before collecting money.",
    );
  }
}

export class MockVideoProvider implements VideoProvider {
  async createRandomRoom(sessionId: string) {
    return {
      roomName: `random-${sessionId}`,
      tokenA: "mock-token-a",
      tokenB: "mock-token-b",
    };
  }

  async createLiveRoom(streamId: string, hostId: string) {
    return {
      roomName: `live-${streamId}`,
      hostToken: `mock-host-${hostId}`,
    };
  }
}

export class MockPayoutProvider implements PayoutProvider {
  async payout(input: { withdrawalId: string; amountCents: number }) {
    return { providerRef: `mock-payout-${input.withdrawalId}`, status: "pending" as const };
  }
}

export class MockNotificationProvider implements NotificationProvider {
  async push() {
    return;
  }
}
