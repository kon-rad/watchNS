import SwipeDeck from "@/components/SwipeDeck";
import { getVideosForSwipe } from "@/actions/videos";

export default async function SwipePage() {
  const initialVideos = await getVideosForSwipe();

  return (
    <div className="fixed inset-0 top-[72px] bottom-16 md:bottom-0 flex flex-col overflow-hidden">
      <SwipeDeck initialVideos={initialVideos} />
    </div>
  );
}
