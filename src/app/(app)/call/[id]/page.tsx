import { PrivateCall } from "@/components/private-call";

export const metadata = { robots: { index: false }, title: "Private video" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrivateCall connectionId={id} />;
}
