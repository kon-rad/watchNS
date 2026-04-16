import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "watchns.db");
const sqlite = new Database(dbPath);

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Seed creators
const creators = [
  {
    name: "Balaji Srinivasan",
    platform: "youtube",
    channel_url: "https://www.youtube.com/@balaboratory",
    avatar_url: null,
  },
  {
    name: "Network School",
    platform: "youtube",
    channel_url: "https://www.youtube.com/@thenetworkstate",
    avatar_url: null,
  },
  {
    name: "NS Community",
    platform: "tiktok",
    channel_url: "https://www.tiktok.com/@networkschool",
    avatar_url: null,
  },
];

const insertCreator = sqlite.prepare(
  `INSERT OR IGNORE INTO creators (name, platform, channel_url, avatar_url, created_at)
   VALUES (?, ?, ?, ?, ?)`
);

const insertVideo = sqlite.prepare(
  `INSERT OR IGNORE INTO videos (creator_id, url, embed_url, platform, title, thumbnail_url, like_count, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

const now = Math.floor(Date.now() / 1000);

const creatorIds: number[] = [];

const insertCreators = sqlite.transaction(() => {
  for (const c of creators) {
    const result = insertCreator.run(c.name, c.platform, c.channel_url, c.avatar_url, now);
    creatorIds.push(Number(result.lastInsertRowid));
  }
});

insertCreators();

// Fetch actual creator IDs
const allCreators = sqlite.prepare("SELECT id, name FROM creators").all() as Array<{id: number, name: string}>;
const creatorMap = new Map(allCreators.map(c => [c.name, c.id]));

const videos = [
  {
    creator: "Balaji Srinivasan",
    url: "https://www.youtube.com/watch?v=VeH7qKZr0WI",
    embed_url: "https://www.youtube.com/embed/VeH7qKZr0WI",
    platform: "youtube",
    title: "The Network State in 5 Minutes",
    thumbnail_url: "https://img.youtube.com/vi/VeH7qKZr0WI/maxresdefault.jpg",
  },
  {
    creator: "Network School",
    url: "https://www.youtube.com/watch?v=P8gKSCdExNQ",
    embed_url: "https://www.youtube.com/embed/P8gKSCdExNQ",
    platform: "youtube",
    title: "Network School Introduction",
    thumbnail_url: "https://img.youtube.com/vi/P8gKSCdExNQ/maxresdefault.jpg",
  },
  {
    creator: "Balaji Srinivasan",
    url: "https://www.youtube.com/watch?v=cOQiCaVLEko",
    embed_url: "https://www.youtube.com/embed/cOQiCaVLEko",
    platform: "youtube",
    title: "How to Start a New Country",
    thumbnail_url: "https://img.youtube.com/vi/cOQiCaVLEko/maxresdefault.jpg",
  },
  {
    creator: "Network School",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    platform: "youtube",
    title: "Building the Future of Education",
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  },
  {
    creator: "Balaji Srinivasan",
    url: "https://www.youtube.com/watch?v=3Fx5Q8xGU8k",
    embed_url: "https://www.youtube.com/embed/3Fx5Q8xGU8k",
    platform: "youtube",
    title: "The Pseudonymous Economy",
    thumbnail_url: "https://img.youtube.com/vi/3Fx5Q8xGU8k/maxresdefault.jpg",
  },
];

const insertVideos = sqlite.transaction(() => {
  for (const v of videos) {
    const creatorId = creatorMap.get(v.creator);
    if (!creatorId) continue;
    insertVideo.run(
      creatorId,
      v.url,
      v.embed_url,
      v.platform,
      v.title,
      v.thumbnail_url,
      0,
      now
    );
  }
});

insertVideos();

console.log(`Seeded ${allCreators.length} creators and ${videos.length} videos`);
sqlite.close();
