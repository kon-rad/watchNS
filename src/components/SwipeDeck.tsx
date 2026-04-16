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
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md mb-6 px-2 flex justify-between items-end">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-[0.2em] uppercase">
            Discovery
          </span>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
            Swipe to Watch
          </h2>
        </div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md aspect-[9/16]">
        {/* Background card for stacking effect */}
        <div className="absolute inset-0 bg-surface-container-high rounded-2xl scale-95 translate-y-4 opacity-40 blur-[2px] -z-10" />
        <SwipeCard
          key={currentVideo.id}
          video={currentVideo}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex gap-12 items-center justify-center w-full">
        <button
          onClick={handleSwipeLeft}
          className="flex flex-col items-center gap-3 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-error border border-outline-variant/20 hover:bg-error hover:text-on-error transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-error transition-colors">
            Skip
          </span>
        </button>
        <button
          onClick={handleSwipeRight}
          className="flex flex-col items-center gap-3 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary border border-outline-variant/20 hover:bg-gradient-to-br hover:from-tertiary hover:to-tertiary-container hover:text-on-tertiary transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-tertiary transition-colors">
            Favorite
          </span>
        </button>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
