"use client";

import dynamic from "next/dynamic";
import { getEmbedUrl, type Platform } from "@/lib/platform";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function VideoEmbed({
  url,
  platform,
  playing = false,
  controls = true,
}: {
  url: string;
  platform: Platform;
  playing?: boolean;
  controls?: boolean;
}) {
  // react-player has no Instagram or TikTok player, so it falls through to
  // FilePlayer and tries to load the HTML page as a video file (which fails).
  // For those platforms, render the platform's own embed iframe instead.
  if (platform === "instagram" || platform === "tiktok") {
    const embedUrl = getEmbedUrl(platform, url);
    if (embedUrl && embedUrl !== url) {
      return (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; encrypted-media; clipboard-write; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      );
    }
  }

  return (
    <ReactPlayer
      url={url}
      playing={playing}
      controls={controls}
      width="100%"
      height="100%"
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
}
