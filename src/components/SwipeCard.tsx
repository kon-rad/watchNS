"use client";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import dynamic from "next/dynamic";
import type { VideoWithCreator } from "@/actions/videos";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const SWIPE_THRESHOLD = 100;

export default function SwipeCard({
  video,
  onSwipeLeft,
  onSwipeRight,
}: {
  video: VideoWithCreator;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);

  const rotation = dragX * 0.1;
  const skipOpacity = Math.min(Math.abs(Math.min(dragX, 0)) / SWIPE_THRESHOLD, 1);
  const favOpacity = Math.min(Math.max(dragX, 0) / SWIPE_THRESHOLD, 1);

  function animateOut(direction: "left" | "right") {
    setExiting(direction);
    setTimeout(() => {
      if (direction === "left") onSwipeLeft();
      else onSwipeRight();
    }, 300);
  }

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setDragX(e.deltaX);
    },
    onSwipedLeft: () => {
      if (Math.abs(dragX) > SWIPE_THRESHOLD) {
        animateOut("left");
      } else {
        setDragX(0);
      }
    },
    onSwipedRight: () => {
      if (dragX > SWIPE_THRESHOLD) {
        animateOut("right");
      } else {
        setDragX(0);
      }
    },
    onSwiped: () => {
      if (!exiting) setDragX(0);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const exitTransform =
    exiting === "left"
      ? "translateX(-150%) rotate(-30deg)"
      : exiting === "right"
        ? "translateX(150%) rotate(30deg)"
        : `translateX(${dragX}px) rotate(${rotation}deg)`;

  return (
    <div
      {...handlers}
      className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border border-white/5 bg-surface-container-lowest"
      style={{
        transform: exitTransform,
        transition: exiting || dragX === 0 ? "transform 0.3s ease-out" : "none",
        touchAction: "pan-y",
      }}
    >
      {/* Video / Thumbnail */}
      {playing ? (
        <div className="absolute inset-0">
          <ReactPlayer
            url={video.url}
            playing
            controls
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
      ) : (
        <>
          {video.thumbnailUrl ? (
            <>
              {/* Blurred backdrop fills any letterbox space */}
              <img
                src={video.thumbnailUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
              />
              {/* Foreground thumbnail — preserves natural aspect ratio */}
              <img
                src={video.thumbnailUrl}
                alt={video.title || "Video thumbnail"}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlaying(true)}
              className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-110 transition-transform active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Swipe labels */}
      <div
        className="absolute top-10 left-6 -rotate-12 border-4 border-error/80 px-4 py-1 rounded-lg pointer-events-none"
        style={{ opacity: skipOpacity }}
      >
        <span className="text-error font-black text-2xl uppercase tracking-tighter">
          Skip
        </span>
      </div>
      <div
        className="absolute top-10 right-6 rotate-12 border-4 border-tertiary/80 px-4 py-1 rounded-lg pointer-events-none"
        style={{ opacity: favOpacity }}
      >
        <span className="text-tertiary font-black text-2xl uppercase tracking-tighter">
          Fav
        </span>
      </div>

      {/* Link-out button */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 pointer-events-auto flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white/80 text-xs font-bold hover:bg-white/20 transition-colors border border-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}
