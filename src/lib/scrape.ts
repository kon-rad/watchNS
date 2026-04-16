import type { Platform } from "./platform";

interface ScrapedMeta {
  title: string | null;
  thumbnailUrl: string | null;
  authorName: string | null;
  authorUrl: string | null;
  authorAvatar: string | null;
}

async function fetchOembed(endpoint: string): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function scrapeMetaTags(url: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WatchNS/1.0)" },
    });
    if (!res.ok) return {};
    const html = await res.text();

    const meta: Record<string, string> = {};
    const ogMatches = html.matchAll(
      /<meta[^>]+property=["']og:(\w+)["'][^>]+content=["']([^"']+)["']/gi
    );
    for (const match of ogMatches) {
      meta[match[1]] = match[2];
    }
    return meta;
  } catch {
    return {};
  }
}

export async function scrapeVideoMeta(
  platform: Platform,
  url: string
): Promise<ScrapedMeta> {
  const empty: ScrapedMeta = {
    title: null,
    thumbnailUrl: null,
    authorName: null,
    authorUrl: null,
    authorAvatar: null,
  };

  if (platform === "youtube") {
    const data = await fetchOembed(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (data) {
      return {
        title: data.title || null,
        thumbnailUrl: data.thumbnail_url || null,
        authorName: data.author_name || null,
        authorUrl: data.author_url || null,
        authorAvatar: null,
      };
    }
    return empty;
  }

  if (platform === "tiktok") {
    const data = await fetchOembed(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (data) {
      return {
        title: data.title || null,
        thumbnailUrl: data.thumbnail_url || null,
        authorName: data.author_name || null,
        authorUrl: data.author_url || null,
        authorAvatar: null,
      };
    }
    return empty;
  }

  if (platform === "instagram") {
    // Instagram oEmbed requires a Meta app token, likely to fail
    // Fall back to meta tag scraping
    const meta = await scrapeMetaTags(url);
    return {
      title: meta.title || null,
      thumbnailUrl: meta.image || null,
      authorName: meta.description?.split("•")?.[0]?.trim() || null,
      authorUrl: null,
      authorAvatar: null,
    };
  }

  return empty;
}

export async function scrapeChannelMeta(
  platform: Platform,
  url: string
): Promise<{ name: string | null; avatarUrl: string | null }> {
  const meta = await scrapeMetaTags(url);
  return {
    name: meta.title || null,
    avatarUrl: meta.image || null,
  };
}

export async function scrapeChannelVideoUrls(
  platform: Platform,
  channelUrl: string,
  limit: number = 10
): Promise<string[]> {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  };

  try {
    if (platform === "youtube") {
      let videosUrl = channelUrl.replace(/\/+$/, "");
      if (!videosUrl.endsWith("/videos")) {
        videosUrl += "/videos";
      }

      const res = await fetch(videosUrl, {
        signal: AbortSignal.timeout(10000),
        headers,
      });
      if (!res.ok) return [];
      const html = await res.text();

      const videoIds = new Set<string>();
      const patterns = [
        /\/watch\?v=([a-zA-Z0-9_-]{11})/g,
        /"videoId":"([a-zA-Z0-9_-]{11})"/g,
      ];

      for (const pattern of patterns) {
        for (const match of html.matchAll(pattern)) {
          videoIds.add(match[1]);
          if (videoIds.size >= limit) break;
        }
        if (videoIds.size >= limit) break;
      }

      return [...videoIds]
        .slice(0, limit)
        .map((id) => `https://www.youtube.com/watch?v=${id}`);
    }

    if (platform === "instagram") {
      // Strip query params for a clean profile URL
      const profileUrl = channelUrl.split("?")[0].replace(/\/+$/, "");

      const res = await fetch(profileUrl + "/", {
        signal: AbortSignal.timeout(10000),
        headers,
      });
      if (!res.ok) return [];
      const html = await res.text();

      const reelIds = new Set<string>();
      // Instagram embeds reel/post shortcodes in the HTML
      const patterns = [
        /\/reel\/([A-Za-z0-9_-]+)/g,
        /\/p\/([A-Za-z0-9_-]+)/g,
      ];

      for (const pattern of patterns) {
        for (const match of html.matchAll(pattern)) {
          reelIds.add(match[1]);
          if (reelIds.size >= limit) break;
        }
        if (reelIds.size >= limit) break;
      }

      return [...reelIds]
        .slice(0, limit)
        .map((id) => `https://www.instagram.com/reel/${id}/`);
    }

    if (platform === "tiktok") {
      const profileUrl = channelUrl.split("?")[0].replace(/\/+$/, "");

      const res = await fetch(profileUrl, {
        signal: AbortSignal.timeout(10000),
        headers,
      });
      if (!res.ok) return [];
      const html = await res.text();

      const videoIds = new Set<string>();
      // TikTok includes video IDs in the page HTML/JSON
      const patterns = [
        /\/video\/(\d{15,25})/g,
        /"id":"(\d{15,25})"/g,
      ];

      // Extract the username from the URL for building full video URLs
      const username = profileUrl.match(/@([\w.]+)/)?.[1];

      for (const pattern of patterns) {
        for (const match of html.matchAll(pattern)) {
          videoIds.add(match[1]);
          if (videoIds.size >= limit) break;
        }
        if (videoIds.size >= limit) break;
      }

      return [...videoIds]
        .slice(0, limit)
        .map(
          (id) =>
            `https://www.tiktok.com/@${username || "user"}/video/${id}`
        );
    }

    return [];
  } catch (e) {
    console.error("[scrapeChannelVideoUrls] error:", e);
    return [];
  }
}
