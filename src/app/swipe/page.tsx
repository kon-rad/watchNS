import SwipeDeck from "@/components/SwipeDeck";
import { getVideosForSwipe } from "@/actions/videos";

export default async function SwipePage() {
  const initialVideos = await getVideosForSwipe();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 relative overflow-hidden">
      <SwipeDeck initialVideos={initialVideos} />
    </div>
  );
}
