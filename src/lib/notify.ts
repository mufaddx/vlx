import { prisma } from "./db";

export async function notify(userId: string, type: string, title: string, body: string, href?: string) {
  await prisma.notification.create({ data: { userId, type, title, body, href } });
}
