"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toggleFavorite } from "@/actions/videos";
import type { VideoWithCreator } from "@/actions/videos";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function getPlatformLabel(platform: string) {
  switch (platform) {
    case "youtube": return "YouTube";
    case "tiktok": return "TikTok";
    case "instagram": return "Instagram";
    default: return platform;
  }
}

export default function VideoDetailClient({
  video,
}: {
  video: VideoWithCreator & { isFavorited: boolean };
}) {
  const [isFav, setIsFav] = useState(video.isFavorited);
  const [likeCount, setLikeCount] = useState(video.likeCount);

  async function handleToggleFav() {
    const optimisticFav = !isFav;
    setIsFav(optimisticFav);
    setLikeCount((c) => c + (optimisticFav ? 1 : -1));
    const result = await toggleFavorite(video.id);
    setIsFav(result.isFavorited);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      {/* Back button */}
      <Link
        href="/swipe"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      {/* Video player */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-container-lowest editorial-shadow">
        <ReactPlayer
          url={video.url}
          controls
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      {/* Video info */}
      <div className="mt-8 space-y-6">
        <h1 className="text-3xl font-headline font-bold text-on-surface">
          {video.title || "Untitled Video"}
        </h1>

        <div className="flex items-center justify-between">
          {/* Creator info */}
          <div className="flex items-center gap-4">
            {video.creatorAvatar ? (
              <img
                src={video.creatorAvatar}
                alt={video.creatorName}
                className="w-12 h-12 rounded-full border-2 border-primary object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-primary bg-surface-container-high flex items-center justify-center text-primary font-bold text-lg">
                {video.creatorName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-headline font-bold text-on-surface text-lg">
                {video.creatorName}
              </p>
              <a
                href={video.creatorChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                View Channel
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="font-bold">{video.viewCount}</span>
            </div>
            <button
              onClick={handleToggleFav}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all active:scale-95 ${
                isFav
                  ? "bg-tertiary text-on-tertiary-fixed"
                  : "bg-surface-container-high text-on-surface border border-outline-variant/20 hover:bg-surface-bright"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likeCount}
            </button>
          </div>
        </div>

        {/* Platform link-out */}
        <div className="flex justify-end">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-bright px-5 py-3 rounded-full text-on-surface font-bold text-sm transition-colors border border-outline-variant/20"
          >
            Watch on {getPlatformLabel(video.platform)}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
