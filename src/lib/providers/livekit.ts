import { SignJWT } from "jose";
import type { VideoProvider } from "./types";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

async function livekitToken(input: {
  identity: string;
  room: string;
  canPublish: boolean;
  canSubscribe: boolean;
}) {
  const apiKey = required("LIVEKIT_API_KEY");
  const apiSecret = required("LIVEKIT_API_SECRET");
  return new SignJWT({
    video: {
      roomJoin: true,
      room: input.room,
      canPublish: input.canPublish,
      canSubscribe: input.canSubscribe,
      canPublishData: true,
    },
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(apiKey)
    .setSubject(input.identity)
    .setNotBefore(Math.floor(Date.now() / 1000) - 10)
    .setExpirationTime("6h")
    .sign(new TextEncoder().encode(apiSecret));
}

export class LiveKitVideoProvider implements VideoProvider {
  async createRandomRoom(sessionId: string) {
    const roomName = `vidlix-random-${sessionId}`;
    const tokenA = await livekitToken({
      identity: `a-${sessionId}`,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });
    const tokenB = await livekitToken({
      identity: `b-${sessionId}`,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });
    return { roomName, tokenA, tokenB };
  }

  async createLiveRoom(streamId: string, hostId: string) {
    const roomName = `vidlix-live-${streamId}`;
    const hostToken = await livekitToken({
      identity: `host-${hostId}`,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });
    return { roomName, hostToken };
  }

  async participantToken(roomName: string, identity: string, canPublish: boolean) {
    return livekitToken({ identity, room: roomName, canPublish, canSubscribe: true });
  }
}

export function livekitConfigured() {
  return Boolean(process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET && process.env.LIVEKIT_URL);
}
