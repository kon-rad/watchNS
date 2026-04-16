import type { Platform } from "./platform";

export interface ScrapedMeta {
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  authorName: string | null;
  authorUrl: string | null;
  authorAvatar: string | null;
  duration: string | null;
  publishedAt: string | null;
  genre: string | null;
  sourceLikeCount: number | null;
  sourceViewCount: number | null;
  commentCount: number | null;
}

export interface ScrapedChannelMeta {
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followerCount: number | null;
  followingCount: number | null;
  totalLikesReceived: number | null;
  externalUrl: string | null;
}

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

const IG_HEADERS = {
  "User-Agent":
    "Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; Google/google; Pixel 7; panther; panther; en_US; 458229258)",
  "X-IG-App-ID": "936619743392459",
};

async function fetchOembed(endpoint: string): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function scrapeAllMetaTags(url: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: BROWSER_HEADERS,
    });
    if (!res.ok) return {};
    const html = await res.text();

    const meta: Record<string, string> = {};
    // og: tags
    for (const match of html.matchAll(
      /<meta[^>]+property=["']og:(\w+)["'][^>]+content=["']([^"']+)["']/gi
    )) {
      meta[`og:${match[1]}`] = match[2];
    }
    // name/itemprop meta tags
    for (const match of html.matchAll(
      /<meta[^>]+(?:name|itemprop)=["']([\w:]+)["'][^>]+content=["']([^"']*?)["']/gi
    )) {
      meta[match[1]] = match[2];
    }
    // Reverse order (content first)
    for (const match of html.matchAll(
      /<meta[^>]+content=["']([^"']*?)["'][^>]+(?:name|itemprop|property)=["']([\w:]+)["']/gi
    )) {
      meta[match[2]] = match[1];
    }
    return meta;
  } catch {
    return {};
  }
}

const EMPTY_META: ScrapedMeta = {
  title: null,
  description: null,
  thumbnailUrl: null,
  authorName: null,
  authorUrl: null,
  authorAvatar: null,
  duration: null,
  publishedAt: null,
  genre: null,
  sourceLikeCount: null,
  sourceViewCount: null,
  commentCount: null,
};

export async function scrapeVideoMeta(
  platform: Platform,
  url: string
): Promise<ScrapedMeta> {
  if (platform === "youtube") {
    // Scrape the video page for rich meta tags
    const meta = await scrapeAllMetaTags(url);
    const oembed = await fetchOembed(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );

    const viewCount = meta.interactionCount
      ? parseInt(meta.interactionCount, 10)
      : meta.userInteractionCount
        ? parseInt(meta.userInteractionCount, 10)
        : null;

    return {
      title: meta["og:title"] || oembed?.title || null,
      description: meta["og:description"] || meta.description || null,
      thumbnailUrl: meta["og:image"] || oembed?.thumbnail_url || null,
      authorName: meta.name || oembed?.author_name || null,
      authorUrl: oembed?.author_url || null,
      authorAvatar: null,
      duration: meta.duration || null,
      publishedAt: meta.datePublished || meta.uploadDate || null,
      genre: meta.genre || null,
      sourceLikeCount: null, // YouTube doesn't expose like count in meta tags
      sourceViewCount: viewCount,
      commentCount: null,
    };
  }

  if (platform === "tiktok") {
    const oembed = await fetchOembed(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    );
    return {
      title: oembed?.title || null,
      description: oembed?.title || null, // TikTok title IS the description
      thumbnailUrl: oembed?.thumbnail_url || null,
      authorName: oembed?.author_name || null,
      authorUrl: oembed?.author_url || null,
      authorAvatar: null,
      duration: null,
      publishedAt: null,
      genre: null,
      sourceLikeCount: null,
      sourceViewCount: null,
      commentCount: null,
    };
  }

  if (platform === "instagram") {
    // The per-media API often requires auth, but try anyway
    try {
      const shortcode = url.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/)?.[2];
      if (shortcode) {
        const res = await fetch(
          `https://www.instagram.com/api/v1/media/${shortcode}/info/`,
          { signal: AbortSignal.timeout(5000), headers: IG_HEADERS }
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
              description: caption,
              thumbnailUrl: thumb,
              authorName: item.user?.full_name || item.user?.username || null,
              authorUrl: item.user?.username
                ? `https://www.instagram.com/${item.user.username}/`
                : null,
              authorAvatar: item.user?.profile_pic_url || null,
              duration: item.video_duration
                ? `PT${Math.round(item.video_duration)}S`
                : null,
              publishedAt: item.taken_at
                ? new Date(item.taken_at * 1000).toISOString()
                : null,
              genre: null,
              sourceLikeCount: item.like_count ?? null,
              sourceViewCount:
                item.play_count ?? item.view_count ?? null,
              commentCount: item.comment_count ?? null,
            };
          }
        }
      }
    } catch {
      // fall through
    }
    return { ...EMPTY_META };
  }

  return { ...EMPTY_META };
}

export async function scrapeChannelMeta(
  platform: Platform,
  url: string
): Promise<ScrapedChannelMeta> {
  const empty: ScrapedChannelMeta = {
    name: null,
    avatarUrl: null,
    bio: null,
    followerCount: null,
    followingCount: null,
    totalLikesReceived: null,
    externalUrl: null,
  };

  if (platform === "instagram") {
    try {
      const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
      const username = cleanUrl.split("/").pop();
      if (!username) return empty;

      const res = await fetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        { signal: AbortSignal.timeout(10000), headers: IG_HEADERS }
      );
      if (!res.ok) return empty;
      const data = await res.json();
      const user = data?.data?.user;
      if (!user) return empty;
      return {
        name: user.full_name || username,
        avatarUrl: user.profile_pic_url_hd || user.profile_pic_url || null,
        bio: user.biography || null,
        followerCount: user.edge_followed_by?.count ?? null,
        followingCount: user.edge_follow?.count ?? null,
        totalLikesReceived: null,
        externalUrl: user.external_url || null,
      };
    } catch {
      return empty;
    }
  }

  if (platform === "tiktok") {
    try {
      const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
      const res = await fetch(cleanUrl, {
        signal: AbortSignal.timeout(10000),
        headers: BROWSER_HEADERS,
      });
      if (!res.ok) return empty;
      const html = await res.text();
      const match = html.match(
        /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/
      );
      if (match) {
        const data = JSON.parse(match[1]);
        const userInfo =
          data?.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo;
        const user = userInfo?.user;
        const stats = userInfo?.stats;
        if (user) {
          return {
            name: user.nickname || user.uniqueId || null,
            avatarUrl: user.avatarLarger || user.avatarMedium || null,
            bio: user.signature || null,
            followerCount: stats?.followerCount ?? null,
            followingCount: stats?.followingCount ?? null,
            totalLikesReceived: stats?.heartCount ?? null,
            externalUrl: null,
          };
        }
      }
    } catch {
      // fall through
    }
  }

  if (platform === "youtube") {
    // Scrape YouTube channel page for meta tags
    const meta = await scrapeAllMetaTags(url);
    return {
      name: meta["og:title"] || null,
      avatarUrl: meta["og:image"] || null,
      bio: meta["og:description"] || meta.description || null,
      followerCount: null,
      followingCount: null,
      totalLikesReceived: null,
      externalUrl: null,
    };
  }

  return empty;
}

/** Scrape Instagram profile and return enriched video metadata alongside URLs */
export async function scrapeInstagramVideosWithMeta(
  username: string,
  limit: number = 50
): Promise<
  { url: string; meta: ScrapedMeta }[]
> {
  try {
    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      { signal: AbortSignal.timeout(15000), headers: IG_HEADERS }
    );
    if (!res.ok) return [];

    const data = await res.json();
    const edges =
      data?.data?.user?.edge_owner_to_timeline_media?.edges || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return edges
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) =>
          e.node?.__typename === "GraphVideo" ||
          e.node?.__typename === "GraphSidecar" ||
          e.node?.is_video
      )
      .slice(0, limit)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((e: any) => {
        const node = e.node;
        const captionEdges = node.edge_media_to_caption?.edges || [];
        const caption = captionEdges[0]?.node?.text || null;
        return {
          url: `https://www.instagram.com/reel/${node.shortcode}/`,
          meta: {
            title: caption?.split("\n")[0]?.slice(0, 100) || null,
            description: caption,
            thumbnailUrl: node.display_url || node.thumbnail_src || null,
            authorName: null,
            authorUrl: null,
            authorAvatar: null,
            duration: null,
            publishedAt: node.taken_at_timestamp
              ? new Date(node.taken_at_timestamp * 1000).toISOString()
              : null,
            genre: null,
            sourceLikeCount: node.edge_media_preview_like?.count ?? node.edge_liked_by?.count ?? null,
            sourceViewCount: node.video_view_count ?? null,
            commentCount: node.edge_media_to_comment?.count ?? null,
          } satisfies ScrapedMeta,
        };
      });
  } catch (e) {
    console.error("[scrapeInstagramVideosWithMeta] error:", e);
    return [];
  }
}

export async function scrapeChannelVideoUrls(
  platform: Platform,
  channelUrl: string,
  limit: number = 50
): Promise<string[]> {
  try {
    if (platform === "youtube") {
      let videosUrl = channelUrl.replace(/\/+$/, "");
      if (!videosUrl.endsWith("/videos")) {
        videosUrl += "/videos";
      }

      const res = await fetch(videosUrl, {
        signal: AbortSignal.timeout(15000),
        headers: BROWSER_HEADERS,
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
      const cleanUrl = channelUrl.split("?")[0].replace(/\/+$/, "");
      const username = cleanUrl.split("/").pop();
      if (!username) return [];

      const items = await scrapeInstagramVideosWithMeta(username, limit);
      return items.map((i) => i.url);
    }

    if (platform === "tiktok") {
      const profileUrl = channelUrl.split("?")[0].replace(/\/+$/, "");
      const username = profileUrl.match(/@([\w.]+)/)?.[1];
      if (!username) return [];

      const embedUrl = `https://www.tiktok.com/embed/@${username}`;
      const res = await fetch(embedUrl, {
        signal: AbortSignal.timeout(15000),
        headers: BROWSER_HEADERS,
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
        .map((id) => `https://www.tiktok.com/@${username}/video/${id}`);
    }

    return [];
  } catch (e) {
    console.error("[scrapeChannelVideoUrls] error:", e);
    return [];
  }
}
