import SwipeDeck from "@/components/SwipeDeck";
import { getVideosForSwipe } from "@/actions/videos";

export default async function SwipePage() {
  const initialVideos = await getVideosForSwipe();

  return (
    <div className="h-screen flex flex-col items-center relative overflow-hidden">
      <SwipeDeck initialVideos={initialVideos} />
    </div>
  );
}
