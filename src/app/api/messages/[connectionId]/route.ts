import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ connectionId: string }> }) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { connectionId } = await params;
  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection || (connection.userAId !== me.id && connection.userBId !== me.id)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const [messages, typing] = await Promise.all([
    prisma.message.findMany({
      where: { connectionId },
      orderBy: { createdAt: "asc" },
      take: 200,
      select: { id: true, senderId: true, body: true, createdAt: true },
    }),
    prisma.typingState.findFirst({
      where: {
        connectionId,
        userId: { not: me.id },
        updatedAt: { gt: new Date(Date.now() - 4000) },
      },
    }),
  ]);
  await prisma.message.findMany({
    where: { connectionId, receiverId: me.id, reads: { none: { userId: me.id } } },
    select: { id: true },
  }).then(async (unread) => {
    if (unread.length) {
      await prisma.messageRead.createMany({
        data: unread.map((m) => ({ messageId: m.id, userId: me.id })),
      });
    }
  });
  return NextResponse.json({
    messages: messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
    typing: Boolean(typing),
  });
}
