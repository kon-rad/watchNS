"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { getChannelWithVideos } from "@/actions/videos";
import type { VideoWithCreator, CreatorWithStats, SortOption } from "@/actions/videos";
import ExpandableDetails from "@/components/ExpandableDetails";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-on-surface-variant shrink-0">{label}</span>
      <span className="text-on-surface text-right">{typeof value === "number" ? formatNumber(value) : value}</span>
    </div>
  );
}

export default function ChannelDetailClient({
  channel,
  initialVideos,
}: {
  channel: CreatorWithStats;
  initialVideos: VideoWithCreator[];
}) {
  const [sort, setSort] = useState<SortOption>("likes");
  const [videoList, setVideoList] = useState(initialVideos);
  const [isPending, startTransition] = useTransition();

  function handleSort(newSort: SortOption) {
    setSort(newSort);
    startTransition(async () => {
      const data = await getChannelWithVideos(channel.id, newSort);
      if (data) setVideoList(data.videos);
    });
  }

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "likes", label: "Likes" },
    { value: "views", label: "Views" },
    { value: "a-z", label: "A\u2013Z" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen">
      {/* Back */}
      <Link
        href="/browse"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Browse
      </Link>

      {/* Channel header */}
      <div className="flex items-center gap-6 mb-6">
        {channel.avatarUrl ? (
          <img
            src={channel.avatarUrl}
            alt={channel.name}
            className="w-20 h-20 rounded-full border-2 border-primary object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-primary bg-surface-container-high flex items-center justify-center text-primary font-bold text-3xl">
            {channel.name[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
            {channel.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-on-surface-variant text-sm">
            <span className="capitalize">{channel.platform}</span>
            <span>{channel.videoCount} video{channel.videoCount !== 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-tertiary">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {channel.totalLikes}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {channel.totalViews}
            </span>
          </div>
          <a
            href={channel.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-primary text-sm hover:underline"
          >
            View on {channel.platform}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Expandable Channel Details */}
      <div className="mb-10">
        <ExpandableDetails title="Channel Details">
          <DetailRow label="Platform" value={channel.platform.charAt(0).toUpperCase() + channel.platform.slice(1)} />
          {channel.followerCount != null && (
            <DetailRow label="Followers" value={channel.followerCount} />
          )}
          {channel.followingCount != null && (
            <DetailRow label="Following" value={channel.followingCount} />
          )}
          {channel.totalLikesReceived != null && (
            <DetailRow label="Total Likes Received" value={channel.totalLikesReceived} />
          )}
          <DetailRow label="Videos on WatchNS" value={channel.videoCount} />
          <DetailRow label="WatchNS Favorites" value={channel.totalLikes} />
          <DetailRow label="WatchNS Views" value={channel.totalViews} />
          {channel.externalUrl && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-on-surface-variant shrink-0">Website</span>
              <a
                href={channel.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-right truncate"
              >
                {channel.externalUrl.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {channel.bio && (
            <div className="pt-2 border-t border-outline-variant/10">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
                Bio
              </p>
              <p className="text-on-surface whitespace-pre-wrap leading-relaxed">
                {channel.bio}
              </p>
            </div>
          )}
        </ExpandableDetails>
      </div>

      {/* Sort + Video list */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline font-bold text-on-surface text-xl">Videos</h2>
        <div className="flex gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
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
      </div>

      <div className={`space-y-3 transition-opacity ${isPending ? "opacity-50" : ""}`}>
        {videoList.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="group flex items-center gap-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl p-3 transition-colors"
          >
            <div className="relative w-28 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title || "Video"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-headline font-bold text-on-surface text-base md:text-lg line-clamp-1">
                {video.title || "Untitled Video"}
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">
                {video.creatorName}
              </p>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0 text-on-surface-variant">
              <div className="flex items-center gap-1.5" title="Likes">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-tertiary">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-sm font-bold">{video.likeCount}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Views">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-sm font-bold">{video.viewCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
