"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { getAllVideos } from "@/actions/videos";
import type { VideoWithCreator, CreatorWithStats, SortOption } from "@/actions/videos";

function SortButtons({
  sort,
  onSort,
}: {
  sort: SortOption;
  onSort: (s: SortOption) => void;
}) {
  const options: { value: SortOption; label: string }[] = [
    { value: "likes", label: "Likes" },
    { value: "views", label: "Views" },
    { value: "a-z", label: "A–Z" },
  ];
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSort(opt.value)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
            sort === opt.value
              ? "bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed"
              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-bright border border-outline-variant/20"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function BrowseClient({
  initialVideos,
  channels,
}: {
  initialVideos: VideoWithCreator[];
  channels: CreatorWithStats[];
}) {
  const [tab, setTab] = useState<"videos" | "channels">("videos");
  const [sort, setSort] = useState<SortOption>("likes");
  const [videoList, setVideoList] = useState(initialVideos);
  const [isPending, startTransition] = useTransition();

  function handleSort(newSort: SortOption) {
    setSort(newSort);
    startTransition(async () => {
      const sorted = await getAllVideos(newSort);
      setVideoList(sorted);
    });
  }

  return (
    <div className="px-6 max-w-7xl mx-auto min-h-screen py-8">
      {/* Header */}
      <section className="mb-8">
        <span className="text-primary font-headline font-bold text-xs tracking-[0.2em] uppercase mb-2 block">
          Library
        </span>
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface">
          Browse
        </h1>
      </section>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab("videos")}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${
            tab === "videos"
              ? "bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          Videos ({videoList.length})
        </button>
        <button
          onClick={() => setTab("channels")}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${
            tab === "channels"
              ? "bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          Channels ({channels.length})
        </button>
      </div>

      {tab === "videos" && (
        <>
          {/* Sort controls */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-on-surface-variant text-sm font-medium">
              Sort by
            </p>
            <SortButtons sort={sort} onSort={handleSort} />
          </div>

          {/* Video list */}
          <div
            className={`space-y-3 transition-opacity ${isPending ? "opacity-50" : ""}`}
          >
            {videoList.map((video) => (
              <Link
                key={video.id}
                href={`/video/${video.id}`}
                className="group flex items-center gap-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl p-3 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-28 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title || "Video"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-primary/30"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-on-surface text-base md:text-lg line-clamp-1">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {video.creatorName}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 flex-shrink-0 text-on-surface-variant">
                  <div className="flex items-center gap-1.5" title="Likes">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-tertiary"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span className="text-sm font-bold">{video.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Views">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-sm font-bold">{video.viewCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {tab === "channels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <Link
              key={channel.id}
              href={`/channel/${channel.id}`}
              className="group bg-surface-container-low hover:bg-surface-container-high rounded-xl p-6 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                {channel.avatarUrl ? (
                  <img
                    src={channel.avatarUrl}
                    alt={channel.name}
                    className="w-14 h-14 rounded-full border-2 border-primary object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border-2 border-primary bg-surface-container-high flex items-center justify-center text-primary font-bold text-xl">
                    {channel.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-headline font-bold text-on-surface text-lg line-clamp-1">
                    {channel.name}
                  </h3>
                  <p className="text-on-surface-variant text-sm capitalize">
                    {channel.platform}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant text-sm">
                <span className="font-bold">
                  {channel.videoCount} video{channel.videoCount !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-tertiary"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {channel.totalLikes}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {channel.totalViews}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
