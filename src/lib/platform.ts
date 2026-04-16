export type Platform = "youtube" | "tiktok" | "instagram";
export type UrlType = "video" | "channel";

interface ParsedUrl {
  platform: Platform;
  type: UrlType;
  url: string;
}

export function parseVideoUrl(rawUrl: string): ParsedUrl | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = url.hostname.replace("www.", "").replace("m.", "");

  // YouTube
  if (host === "youtube.com" || host === "youtu.be") {
    if (
      url.pathname.startsWith("/watch") ||
      url.pathname.startsWith("/shorts/") ||
      host === "youtu.be"
    ) {
      return { platform: "youtube", type: "video", url: rawUrl };
    }
    if (
      url.pathname.startsWith("/@") ||
      url.pathname.startsWith("/c/") ||
      url.pathname.startsWith("/channel/")
    ) {
      return { platform: "youtube", type: "channel", url: rawUrl };
    }
    return null;
  }

  // TikTok
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    if (url.pathname.includes("/video/")) {
      return { platform: "tiktok", type: "video", url: rawUrl };
    }
    if (url.pathname.match(/^\/@[\w.]+\/?$/)) {
      return { platform: "tiktok", type: "channel", url: rawUrl };
    }
    return null;
  }

  // Instagram
  if (host === "instagram.com") {
    if (
      url.pathname.startsWith("/reel/") ||
      url.pathname.startsWith("/p/")
    ) {
      return { platform: "instagram", type: "video", url: rawUrl };
    }
    // Profile page
    if (url.pathname.match(/^\/[\w.]+\/?$/)) {
      return { platform: "instagram", type: "channel", url: rawUrl };
    }
    return null;
  }

  return null;
}

export function getEmbedUrl(platform: Platform, originalUrl: string): string | null {
  try {
    const url = new URL(originalUrl);
    const host = url.hostname.replace("www.", "").replace("m.", "");

    if (platform === "youtube") {
      let videoId: string | null = null;
      if (host === "youtu.be") {
        videoId = url.pathname.slice(1);
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      } else {
        videoId = url.searchParams.get("v");
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // TikTok and Instagram embeds are handled by react-player
    return originalUrl;
  } catch {
    return originalUrl;
  }
}
