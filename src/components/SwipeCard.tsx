"use client";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import dynamic from "next/dynamic";
import type { VideoWithCreator } from "@/actions/videos";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const SWIPE_THRESHOLD = 100;

function getPlatformLabel(platform: string) {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "instagram":
      return "Instagram";
    default:
      return platform;
  }
}

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
      if (playing) return;
      setDragX(e.deltaX);
    },
    onSwipedLeft: () => {
      if (playing) return;
      if (Math.abs(dragX) > SWIPE_THRESHOLD) {
        animateOut("left");
      } else {
        setDragX(0);
      }
    },
    onSwipedRight: () => {
      if (playing) return;
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
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border border-white/5 bg-surface-container-lowest"
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
            <img
              src={video.thumbnailUrl}
              alt={video.title || "Video thumbnail"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
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

      {/* Metadata overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 space-y-3 pointer-events-none">
        <div className="flex items-center gap-3">
          {video.creatorAvatar ? (
            <img
              src={video.creatorAvatar}
              alt={video.creatorName}
              className="w-10 h-10 rounded-full border-2 border-primary object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm">
              {video.creatorName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-headline font-bold text-white">
              {video.creatorName}
            </p>
            <span className="bg-primary/20 text-primary-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {video.platform}
            </span>
          </div>
        </div>
        {video.title && (
          <p className="text-on-surface text-base font-medium leading-tight line-clamp-2">
            {video.title}
          </p>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-tertiary">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-sm font-bold text-white">
              {video.likeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Link-out button */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 right-6 pointer-events-auto flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white/80 text-xs font-bold hover:bg-white/20 transition-colors border border-white/10"
      >
        {getPlatformLabel(video.platform)}
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}
