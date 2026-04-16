/**
 * Channel Sync Script
 *
 * Iterates all channels in the database, scrapes their latest videos,
 * and inserts any that don't already exist. Also refreshes channel metadata.
 *
 * Usage:
 *   npx tsx src/scripts/sync-channels.ts
 *   npx tsx src/scripts/sync-channels.ts --limit 5    # only sync 5 channels
 *   npx tsx src/scripts/sync-channels.ts --channel 8  # sync specific channel
 *
 * Designed to run as a cron job every 5 hours.
 */

import { db } from "@/db";
import { creators, videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getEmbedUrl } from "@/lib/platform";
import type { Platform } from "@/lib/platform";
import {
  scrapeVideoMeta,
  scrapeChannelMeta,
  scrapeChannelVideoUrls,
  scrapeInstagramVideosWithMeta,
} from "@/lib/scrape";

const args = process.argv.slice(2);
const limitFlag = args.indexOf("--limit");
const channelFlag = args.indexOf("--channel");
const channelLimit = limitFlag !== -1 ? parseInt(args[limitFlag + 1], 10) : undefined;
const specificChannelId = channelFlag !== -1 ? parseInt(args[channelFlag + 1], 10) : undefined;

// How many videos to scrape per channel during sync (more than initial 50)
const SYNC_VIDEO_LIMIT = 200;

function log(msg: string) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

async function syncChannel(creator: {
  id: number;
  name: string;
  platform: string;
  channelUrl: string;
}) {
  const platform = creator.platform as Platform;

  // 1. Refresh channel metadata
  log(`  Refreshing metadata for "${creator.name}"...`);
  try {
    const channelMeta = await scrapeChannelMeta(platform, creator.channelUrl);
    if (channelMeta.name || channelMeta.avatarUrl || channelMeta.bio) {
      db.update(creators)
        .set({
          name: channelMeta.name || creator.name,
          avatarUrl: channelMeta.avatarUrl || undefined,
          bio: channelMeta.bio || undefined,
          followerCount: channelMeta.followerCount ?? undefined,
          followingCount: channelMeta.followingCount ?? undefined,
          totalLikesReceived: channelMeta.totalLikesReceived ?? undefined,
          externalUrl: channelMeta.externalUrl || undefined,
        })
        .where(eq(creators.id, creator.id))
        .run();
      log(`  Updated channel metadata`);
    }
  } catch (e) {
    log(`  Warning: Failed to refresh channel meta: ${e}`);
  }

  // 2. Get existing video URLs for this channel to avoid duplicates
  const existingUrls = new Set(
    db
      .select({ url: videos.url })
      .from(videos)
      .where(eq(videos.creatorId, creator.id))
      .all()
      .map((v) => v.url)
  );
  log(`  ${existingUrls.size} existing videos in DB`);

  // 3. Scrape video URLs from the channel
  let newCount = 0;

  if (platform === "instagram") {
    const cleanUrl = creator.channelUrl.split("?")[0].replace(/\/+$/, "");
    const username = cleanUrl.split("/").pop();
    if (!username) {
      log(`  Could not extract Instagram username`);
      return newCount;
    }

    const items = await scrapeInstagramVideosWithMeta(username, SYNC_VIDEO_LIMIT);
    log(`  Found ${items.length} videos from Instagram`);

    for (const item of items) {
      if (existingUrls.has(item.url)) continue;

      try {
        const embedUrl = getEmbedUrl(platform, item.url);
        db.insert(videos)
          .values({
            creatorId: creator.id,
            url: item.url,
            embedUrl,
            platform,
            title: item.meta.title,
            description: item.meta.description,
            thumbnailUrl: item.meta.thumbnailUrl,
            duration: item.meta.duration,
            publishedAt: item.meta.publishedAt,
            genre: item.meta.genre,
            sourceLikeCount: item.meta.sourceLikeCount,
            sourceViewCount: item.meta.sourceViewCount,
            commentCount: item.meta.commentCount,
          })
          .run();
        newCount++;
      } catch {
        // Skip failed inserts
      }
    }
  } else {
    const videoUrls = await scrapeChannelVideoUrls(
      platform,
      creator.channelUrl,
      SYNC_VIDEO_LIMIT
    );
    log(`  Found ${videoUrls.length} videos from scrape`);

    for (const videoUrl of videoUrls) {
      if (existingUrls.has(videoUrl)) continue;

      try {
        const meta = await scrapeVideoMeta(platform, videoUrl);
        const embedUrl = getEmbedUrl(platform, videoUrl);

        db.insert(videos)
          .values({
            creatorId: creator.id,
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
        newCount++;
      } catch {
        // Skip failed inserts
      }
    }
  }

  log(`  Inserted ${newCount} new videos`);
  return newCount;
}

async function main() {
  log("=== Channel Sync Started ===");

  let allCreators;
  if (specificChannelId) {
    const c = db
      .select()
      .from(creators)
      .where(eq(creators.id, specificChannelId))
      .get();
    allCreators = c ? [c] : [];
    log(`Syncing specific channel ID: ${specificChannelId}`);
  } else {
    allCreators = db.select().from(creators).all();
    if (channelLimit) {
      allCreators = allCreators.slice(0, channelLimit);
      log(`Limited to ${channelLimit} channels`);
    }
  }

  log(`Found ${allCreators.length} channel(s) to sync`);

  let totalNew = 0;
  for (const creator of allCreators) {
    log(`\nSyncing [${creator.platform}] "${creator.name}" (ID: ${creator.id})`);
    try {
      const newVideos = await syncChannel(creator);
      totalNew += newVideos;
    } catch (e) {
      log(`  ERROR syncing channel: ${e}`);
    }

    // Small delay between channels to be polite to APIs
    await new Promise((r) => setTimeout(r, 2000));
  }

  log(`\n=== Sync Complete: ${totalNew} new videos added across ${allCreators.length} channel(s) ===`);
}

main().catch((e) => {
  console.error("Fatal sync error:", e);
  process.exit(1);
});
