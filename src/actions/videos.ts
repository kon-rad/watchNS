"use server";

import { db } from "@/db";
import { videos, creators, favorites } from "@/db/schema";
import { eq, notInArray, sql } from "drizzle-orm";
import { getUserId } from "@/lib/user";

export type VideoWithCreator = {
  id: number;
  url: string;
  embedUrl: string | null;
  platform: string;
  title: string | null;
  thumbnailUrl: string | null;
  likeCount: number;
  creatorName: string;
  creatorAvatar: string | null;
  creatorChannelUrl: string;
};

export async function getVideosForSwipe(
  excludeIds: number[] = []
): Promise<VideoWithCreator[]> {
  const userId = await getUserId();

  // Get IDs the user has already favorited
  const favoritedIds = db
    .select({ videoId: favorites.videoId })
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .all()
    .map((f) => f.videoId);

  const allExcluded = [...new Set([...excludeIds, ...favoritedIds])];

  let query = db
    .select({
      id: videos.id,
      url: videos.url,
      embedUrl: videos.embedUrl,
      platform: videos.platform,
      title: videos.title,
      thumbnailUrl: videos.thumbnailUrl,
      likeCount: videos.likeCount,
      creatorName: creators.name,
      creatorAvatar: creators.avatarUrl,
      creatorChannelUrl: creators.channelUrl,
    })
    .from(videos)
    .innerJoin(creators, eq(videos.creatorId, creators.id));

  const results =
    allExcluded.length > 0
      ? query
          .where(notInArray(videos.id, allExcluded))
          .orderBy(sql`RANDOM()`)
          .limit(10)
          .all()
      : query.orderBy(sql`RANDOM()`).limit(10).all();

  return results;
}

export async function toggleFavorite(
  videoId: number
): Promise<{ isFavorited: boolean }> {
  const userId = await getUserId();

  const existing = db
    .select()
    .from(favorites)
    .where(
      sql`${favorites.userId} = ${userId} AND ${favorites.videoId} = ${videoId}`
    )
    .get();

  if (existing) {
    db.delete(favorites)
      .where(
        sql`${favorites.userId} = ${userId} AND ${favorites.videoId} = ${videoId}`
      )
      .run();
    db.update(videos)
      .set({ likeCount: sql`${videos.likeCount} - 1` })
      .where(eq(videos.id, videoId))
      .run();
    return { isFavorited: false };
  } else {
    db.insert(favorites).values({ userId, videoId }).run();
    db.update(videos)
      .set({ likeCount: sql`${videos.likeCount} + 1` })
      .where(eq(videos.id, videoId))
      .run();
    return { isFavorited: true };
  }
}

export async function getFavoriteVideos(): Promise<VideoWithCreator[]> {
  const userId = await getUserId();

  return db
    .select({
      id: videos.id,
      url: videos.url,
      embedUrl: videos.embedUrl,
      platform: videos.platform,
      title: videos.title,
      thumbnailUrl: videos.thumbnailUrl,
      likeCount: videos.likeCount,
      creatorName: creators.name,
      creatorAvatar: creators.avatarUrl,
      creatorChannelUrl: creators.channelUrl,
    })
    .from(favorites)
    .innerJoin(videos, eq(favorites.videoId, videos.id))
    .innerJoin(creators, eq(videos.creatorId, creators.id))
    .where(eq(favorites.userId, userId))
    .orderBy(sql`${favorites.createdAt} DESC`)
    .all();
}

export async function getVideoById(
  videoId: number
): Promise<(VideoWithCreator & { isFavorited: boolean }) | null> {
  const userId = await getUserId();

  const video = db
    .select({
      id: videos.id,
      url: videos.url,
      embedUrl: videos.embedUrl,
      platform: videos.platform,
      title: videos.title,
      thumbnailUrl: videos.thumbnailUrl,
      likeCount: videos.likeCount,
      creatorName: creators.name,
      creatorAvatar: creators.avatarUrl,
      creatorChannelUrl: creators.channelUrl,
    })
    .from(videos)
    .innerJoin(creators, eq(videos.creatorId, creators.id))
    .where(eq(videos.id, videoId))
    .get();

  if (!video) return null;

  const fav = db
    .select()
    .from(favorites)
    .where(
      sql`${favorites.userId} = ${userId} AND ${favorites.videoId} = ${videoId}`
    )
    .get();

  return { ...video, isFavorited: !!fav };
}
