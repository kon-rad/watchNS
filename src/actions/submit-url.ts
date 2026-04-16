"use server";

import { db } from "@/db";
import { creators, videos } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { parseVideoUrl, getEmbedUrl } from "@/lib/platform";
import type { ScrapedMeta } from "@/lib/scrape";
import {
  scrapeVideoMeta,
  scrapeChannelMeta,
  scrapeChannelVideoUrls,
  scrapeInstagramVideosWithMeta,
} from "@/lib/scrape";

async function insertVideoForCreator(
  creatorId: number,
  videoUrl: string,
  platform: string,
  prefetchedMeta?: ScrapedMeta
) {
  const existing = db.select().from(videos).where(eq(videos.url, videoUrl)).get();
  if (existing) return;

  const meta =
    prefetchedMeta ??
    (await scrapeVideoMeta(
      platform as "youtube" | "tiktok" | "instagram",
      videoUrl
    ));
  const embedUrl = getEmbedUrl(
    platform as "youtube" | "tiktok" | "instagram",
    videoUrl
  );

  db.insert(videos)
    .values({
      creatorId,
      url: videoUrl,
      embedUrl,
      platform,
      title: meta.title,
      description: meta.description,
      thumbnailUrl: meta.thumbnailUrl,
      duration: meta.duration,
      publishedAt: meta.publishedAt,
      genre: meta.genre,
      sourceLikeCount: meta.sourceLikeCount,
      sourceViewCount: meta.sourceViewCount,
      commentCount: meta.commentCount,
    })
    .run();
}

export async function submitUrl(
  rawUrl: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseVideoUrl(rawUrl);
  if (!parsed) {
    return { success: false, error: "Unsupported platform or URL format" };
  }

  const { platform, type, url } = parsed;

  if (type === "channel") {
    const channelMeta = await scrapeChannelMeta(platform, url);

    // Normalize channel URL (strip query params for matching)
    const cleanChannelUrl = url.split("?")[0].replace(/\/+$/, "");

    let creator = db
      .select()
      .from(creators)
      .where(
        and(eq(creators.channelUrl, cleanChannelUrl), eq(creators.platform, platform))
      )
      .get();

    if (!creator) {
      // Also check with the original URL
      creator = db
        .select()
        .from(creators)
        .where(
          and(eq(creators.channelUrl, url), eq(creators.platform, platform))
        )
        .get();
    }

    if (!creator) {
      const result = db
        .insert(creators)
        .values({
          name: channelMeta.name || "Unknown Creator",
          avatarUrl: channelMeta.avatarUrl,
          platform,
          channelUrl: cleanChannelUrl,
          bio: channelMeta.bio,
          followerCount: channelMeta.followerCount,
          followingCount: channelMeta.followingCount,
          totalLikesReceived: channelMeta.totalLikesReceived,
          externalUrl: channelMeta.externalUrl,
        })
        .run();
      creator = db
        .select()
        .from(creators)
        .where(eq(creators.id, Number(result.lastInsertRowid)))
        .get()!;
    } else {
      // Update existing creator with fresh metadata
      db.update(creators)
        .set({
          name: channelMeta.name || creator.name,
          avatarUrl: channelMeta.avatarUrl || creator.avatarUrl,
          bio: channelMeta.bio,
          followerCount: channelMeta.followerCount,
          followingCount: channelMeta.followingCount,
          totalLikesReceived: channelMeta.totalLikesReceived,
          externalUrl: channelMeta.externalUrl,
        })
        .where(eq(creators.id, creator.id))
        .run();
    }

    // For Instagram, use the enriched scrape that returns metadata per video
    if (platform === "instagram") {
      const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
      const username = cleanUrl.split("/").pop();
      if (username) {
        const items = await scrapeInstagramVideosWithMeta(username, 50);
        for (const item of items) {
          try {
            await insertVideoForCreator(
              creator.id,
              item.url,
              platform,
              item.meta
            );
          } catch {
            // Skip failed
          }
        }
        return { success: true };
      }
    }

    // For YouTube/TikTok, get URLs then scrape each individually
    const videoUrls = await scrapeChannelVideoUrls(platform, url, 50);

    for (const videoUrl of videoUrls) {
      try {
        await insertVideoForCreator(creator.id, videoUrl, platform);
      } catch {
        // Skip failed video inserts silently
      }
    }

    return { success: true };
  }

  // Single video submission
  const meta = await scrapeVideoMeta(platform, url);

  const channelUrl = meta.authorUrl || url;
  let creator = db
    .select()
    .from(creators)
    .where(
      and(eq(creators.channelUrl, channelUrl), eq(creators.platform, platform))
    )
    .get();

  if (!creator) {
    const result = db
      .insert(creators)
      .values({
        name: meta.authorName || "Unknown Creator",
        avatarUrl: meta.authorAvatar,
        platform,
        channelUrl,
      })
      .run();
    creator = db
      .select()
      .from(creators)
      .where(eq(creators.id, Number(result.lastInsertRowid)))
      .get()!;
  }

  const existingVideo = db
    .select()
    .from(videos)
    .where(eq(videos.url, url))
    .get();

  if (existingVideo) {
    return { success: true };
  }

  const embedUrl = getEmbedUrl(platform, url);

  db.insert(videos)
    .values({
      creatorId: creator.id,
      url,
      embedUrl,
      platform,
      title: meta.title,
      description: meta.description,
      thumbnailUrl: meta.thumbnailUrl,
      duration: meta.duration,
      publishedAt: meta.publishedAt,
      genre: meta.genre,
      sourceLikeCount: meta.sourceLikeCount,
      sourceViewCount: meta.sourceViewCount,
      commentCount: meta.commentCount,
    })
    .run();

  return { success: true };
}
