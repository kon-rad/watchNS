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
    // Try the Instagram oEmbed-like info endpoint
    try {
      const shortcode = url.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/)?.[2];
      if (shortcode) {
        const res = await fetch(
          `https://www.instagram.com/api/v1/media/${shortcode}/info/`,
          {
            signal: AbortSignal.timeout(5000),
            headers: {
              "User-Agent":
                "Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; Google/google; Pixel 7; panther; panther; en_US; 458229258)",
              "X-IG-App-ID": "936619743392459",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const item = data?.items?.[0];
          if (item) {
            const caption = item.caption?.text || null;
            const thumb =
              item.image_versions2?.candidates?.[0]?.url ||
              item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ||
              null;
            return {
              title: caption?.split("\n")[0]?.slice(0, 100) || null,
              thumbnailUrl: thumb,
              authorName: item.user?.full_name || item.user?.username || null,
              authorUrl: item.user?.username
                ? `https://www.instagram.com/${item.user.username}/`
                : null,
              authorAvatar: item.user?.profile_pic_url || null,
            };
          }
        }
      }
    } catch {
      // fall through
    }
    // Fallback to meta tag scraping
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
  if (platform === "instagram") {
    try {
      const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
      const username = cleanUrl.split("/").pop();
      if (!username) return { name: null, avatarUrl: null };

      const res = await fetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        {
          signal: AbortSignal.timeout(10000),
          headers: {
            "User-Agent":
              "Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; Google/google; Pixel 7; panther; panther; en_US; 458229258)",
            "X-IG-App-ID": "936619743392459",
          },
        }
      );
      if (!res.ok) return { name: null, avatarUrl: null };
      const data = await res.json();
      const user = data?.data?.user;
      return {
        name: user?.full_name || username,
        avatarUrl: user?.profile_pic_url_hd || user?.profile_pic_url || null,
      };
    } catch {
      return { name: null, avatarUrl: null };
    }
  }

  if (platform === "tiktok") {
    try {
      const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
      const res = await fetch(cleanUrl, {
        signal: AbortSignal.timeout(10000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) return { name: null, avatarUrl: null };
      const html = await res.text();
      const match = html.match(
        /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/
      );
      if (match) {
        const data = JSON.parse(match[1]);
        const user =
          data?.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo?.user;
        if (user) {
          return {
            name: user.nickname || user.uniqueId || null,
            avatarUrl: user.avatarLarger || user.avatarMedium || null,
          };
        }
      }
    } catch {
      // fall through
    }
  }

  const meta = await scrapeMetaTags(url);
  return {
    name: meta.title || null,
    avatarUrl: meta.image || null,
  };
}

export async function scrapeChannelVideoUrls(
  platform: Platform,
  channelUrl: string,
  limit: number = 50
): Promise<string[]> {
  const browserHeaders = {
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
        signal: AbortSignal.timeout(15000),
        headers: browserHeaders,
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
      // Extract username from URL
      const cleanUrl = channelUrl.split("?")[0].replace(/\/+$/, "");
      const username = cleanUrl.split("/").pop();
      if (!username) return [];

      // Use Instagram's web API with the public app ID
      const res = await fetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        {
          signal: AbortSignal.timeout(15000),
          headers: {
            "User-Agent":
              "Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; Google/google; Pixel 7; panther; panther; en_US; 458229258)",
            "X-IG-App-ID": "936619743392459",
          },
        }
      );
      if (!res.ok) return [];

      const data = await res.json();
      const edges =
        data?.data?.user?.edge_owner_to_timeline_media?.edges || [];

      return edges
        .filter(
          (e: Record<string, Record<string, string>>) =>
            e.node?.__typename === "GraphVideo" ||
            e.node?.__typename === "GraphSidecar" ||
            e.node?.is_video
        )
        .slice(0, limit)
        .map(
          (e: Record<string, Record<string, string>>) =>
            `https://www.instagram.com/reel/${e.node.shortcode}/`
        );
    }

    if (platform === "tiktok") {
      const profileUrl = channelUrl.split("?")[0].replace(/\/+$/, "");
      const username = profileUrl.match(/@([\w.]+)/)?.[1];
      if (!username) return [];

      // Use the embed page which returns video IDs without authentication
      const embedUrl = `https://www.tiktok.com/embed/@${username}`;
      const res = await fetch(embedUrl, {
        signal: AbortSignal.timeout(15000),
        headers: browserHeaders,
      });
      if (!res.ok) return [];
      const html = await res.text();

      const videoIds = new Set<string>();
      const patterns = [
        /\/video\/(\d{15,25})/g,
        /"id":"(\d{15,25})"/g,
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
        .map(
          (id) =>
            `https://www.tiktok.com/@${username}/video/${id}`
        );
    }

    return [];
  } catch (e) {
    console.error("[scrapeChannelVideoUrls] error:", e);
    return [];
  }
}
