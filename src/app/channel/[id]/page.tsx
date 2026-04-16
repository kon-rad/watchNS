import { getChannelWithVideos } from "@/actions/videos";
import { notFound } from "next/navigation";
import ChannelDetailClient from "./ChannelDetailClient";

export default async function ChannelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const channelId = parseInt(id, 10);
  if (isNaN(channelId)) notFound();

  const data = await getChannelWithVideos(channelId);
  if (!data) notFound();

  return <ChannelDetailClient channel={data.channel} initialVideos={data.videos} />;
}
