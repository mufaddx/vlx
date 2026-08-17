import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chatPermission, otherUserId } from "@/lib/chat";
import { getEntitlements, visibleIdentity } from "@/lib/social";
import { ChatThread } from "@/components/chat-thread";
import { markReadAction } from "@/lib/actions/chat";

export const metadata = { robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const connection = await prisma.connection.findUnique({
    where: { id },
    include: { userA: true, userB: true },
  });
  if (!connection || (connection.userAId !== me.id && connection.userBId !== me.id)) notFound();
  const peerId = await otherUserId(connection, me.id);
  const peer = connection.userAId === me.id ? connection.userB : connection.userA;
  const identity = await visibleIdentity({
    viewerId: me.id,
    target: peer,
    connected: true,
    context: "connection",
  });
  const gate = await chatPermission(me.id, peerId, connection.id);
  const ent = await getEntitlements(me.id);
  await markReadAction(connection.id);

  return (
    <div>
      <h1 className="mb-4 font-heading text-2xl font-semibold">Chat</h1>
      <ChatThread
        connectionId={connection.id}
        meId={me.id}
        peerName={identity.name}
        username={identity.username}
        locked={identity.locked}
        peerUsername={peer.username}
        canVideo={ent.videoCallAccess}
        limitWarning={!gate.ok ? gate.error : null}
      />
    </div>
  );
}
