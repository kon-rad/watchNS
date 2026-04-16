"use client";

import { useState, useRef, useEffect } from "react";
import SwipeCard from "./SwipeCard";
import { getVideosForSwipe, toggleFavorite, incrementViewCount } from "@/actions/videos";
import type { VideoWithCreator } from "@/actions/videos";
import Link from "next/link";

export default function SwipeDeck({
  initialVideos,
}: {
  initialVideos: VideoWithCreator[];
}) {
  const [videos, setVideos] = useState<VideoWithCreator[]>(initialVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const loadingRef = useRef(false);
  const exhaustedRef = useRef(false);

  const currentVideo = videos[currentIndex];
  const remaining = videos.length - currentIndex;

  // Track view when a new card becomes current
  useEffect(() => {
    if (currentVideo) {
      incrementViewCount(currentVideo.id);
    }
  }, [currentVideo?.id]);

  useEffect(() => {
    if (remaining <= 3 && remaining > 0 && !loadingRef.current && !exhaustedRef.current) {
      loadingRef.current = true;
      const allSeen = [...seenIdsRef.current, ...videos.map((v) => v.id)];
      getVideosForSwipe(allSeen).then((newVideos) => {
        if (newVideos.length > 0) {
          setVideos((prev) => [...prev, ...newVideos]);
        } else {
          exhaustedRef.current = true;
        }
        loadingRef.current = false;
      });
    }
  }, [remaining, videos]);

  function handleSwipeLeft() {
    if (!currentVideo) return;
    seenIdsRef.current.add(currentVideo.id);
    setCurrentIndex((i) => i + 1);
  }

  async function handleSwipeRight() {
    if (!currentVideo) return;
    seenIdsRef.current.add(currentVideo.id);
    toggleFavorite(currentVideo.id);
    setCurrentIndex((i) => i + 1);
  }

  if (!currentVideo) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/60">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">
          You&apos;ve seen everything!
        </h2>
        <p className="text-on-surface-variant mb-6">
          Check back later for new content, or explore your favorites.
        </p>
        <Link
          href="/favorites"
          className="bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-8 py-3 rounded-full font-bold transition-transform active:scale-95"
        >
          View Favorites
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Card — full width on mobile, constrained on desktop */}
      <div className="relative w-full md:max-w-sm md:mx-auto flex-1" style={{ minHeight: "calc(100vh - 7rem)" }}>
        {/* Background card for stacking effect */}
        <div className="absolute inset-0 bg-surface-container-high rounded-2xl scale-[0.97] translate-y-3 opacity-40 blur-[2px] -z-10" />
        <SwipeCard
          key={currentVideo.id}
          video={currentVideo}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </div>
    </div>
  );
}
