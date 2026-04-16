import { getAllVideos, getAllChannels } from "@/actions/videos";
import BrowseClient from "./BrowseClient";

export default async function BrowsePage() {
  const [videos, channels] = await Promise.all([
    getAllVideos("likes"),
    getAllChannels(),
  ]);

  return <BrowseClient initialVideos={videos} channels={channels} />;
}
