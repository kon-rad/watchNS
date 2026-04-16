import { getVideoById } from "@/actions/videos";
import { notFound } from "next/navigation";
import VideoDetailClient from "./VideoDetailClient";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const videoId = parseInt(id, 10);
  if (isNaN(videoId)) notFound();

  const video = await getVideoById(videoId);
  if (!video) notFound();

  return <VideoDetailClient video={video} />;
}
