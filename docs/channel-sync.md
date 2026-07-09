# Channel Sync System

## Overview

WatchNS has a two-tier video ingestion system:

1. **Immediate ingestion** (user-facing) — When a user submits a channel URL via the "Add Your Links" modal, the app immediately scrapes up to **50 videos** and inserts them into the database. This keeps the submission fast.

2. **Background sync** (cron job) — A scheduled script runs every **5 hours** on the server. It iterates through ALL channels in the database, scrapes for new videos (up to 200 per channel per run), and inserts any that don't already exist. It also refreshes channel metadata (name, avatar, bio, follower counts).

## How It Works

### Initial Submission Flow

```
User pastes channel URL → parseVideoUrl() identifies platform + type
  → scrapeChannelMeta() fetches channel name, avatar, bio, stats
  → Creator record inserted/updated in DB
  → scrapeChannelVideoUrls(platform, url, 50) gets first 50 video URLs
  → For each URL: scrapeVideoMeta() → insert into videos table
  → User sees "Added successfully!" in ~10-30 seconds
```

### Background Sync Flow

```
Cron triggers sync-channels.ts every 5 hours
  → Load all creators from DB
  → For each channel:
    1. Refresh channel metadata (scrapeChannelMeta)
    2. Load existing video URLs from DB (for dedup)
    3. Scrape up to 200 video URLs from channel
    4. For each NEW URL (not in existing set):
       - Fetch full video metadata
       - Insert into videos table with all enriched fields
    5. 2-second delay before next channel (rate limiting)
  → Log summary of new videos added
```

### Deduplication

Videos are deduped by URL. Before inserting, the sync script loads all existing video URLs for that channel into a Set and skips any URL that already exists. This means:
- Re-running the sync is safe (idempotent)
- Only genuinely new videos get inserted
- The same video URL will never appear twice

## Script Usage

```bash
# Sync all channels
npx tsx src/scripts/sync-channels.ts

# Sync only first 3 channels
npx tsx src/scripts/sync-channels.ts --limit 3

# Sync a specific channel by ID
npx tsx src/scripts/sync-channels.ts --channel 8
```

## Cron Job Setup (Server)

The cron job is configured on the production server under the app user's
crontab (server connection details are in the gitignored `DEPLOYMENT.local.md`):

```cron
0 */5 * * * cd <app-dir> && /usr/bin/npx tsx src/scripts/sync-channels.ts >> <app-dir>/watchns-sync.log 2>&1
```

This runs at minute 0 of every 5th hour (00:00, 05:00, 10:00, 15:00, 20:00 UTC).

### Log file

Sync logs are appended to `watchns-sync.log` in the app directory. Each run logs:
- Timestamp for every action
- Number of existing videos per channel
- Number of videos found from scrape
- Number of new videos inserted
- Summary totals

### Monitoring

```bash
# Check last sync run
tail -50 watchns-sync.log

# Check cron is scheduled
crontab -l | grep watchns

# Manually trigger a sync (from the app directory)
npx tsx src/scripts/sync-channels.ts
```

## Platform-Specific Scraping Limits

| Platform   | Initial (50 cap) | Sync (200 cap) | Notes |
|-----------|------------------|-----------------|-------|
| YouTube   | ~30 videos       | up to 200       | Initial HTML carries ~30 IDs; the rest are paged via YouTube's `youtubei/v1/browse` continuation API. |
| Instagram | Up to 12 videos  | Up to 12 videos | API returns last 12 posts from profile endpoint. |
| TikTok    | ~10 videos       | ~10 videos      | Embed page returns ~10 video IDs. |

### YouTube continuation pagination

YouTube's channel page only embeds ~30 videos in the initial HTML; the rest load via JavaScript using continuation tokens. We replicate that flow without a browser:

1. Fetch `/videos` and parse `ytInitialData` from the page.
2. Walk to the "Videos" tab's `richGridRenderer` and pull its `continuationCommand.token` (this avoids picking up tokens for Home/Shorts/etc.).
3. Extract `INNERTUBE_API_KEY` and `INNERTUBE_CONTEXT_CLIENT_VERSION` from the page.
4. POST to `https://www.youtube.com/youtubei/v1/browse?key=<API_KEY>` with `{ context, continuation }`.
5. Each response yields ~30 more video IDs and a fresh continuation token. Loop with a 250 ms delay until the limit is reached, no progress is made, or no token comes back. Capped at 50 pages as a safety against runaway feeds.

No API key is required; this is the same public Innertube endpoint yt-dlp uses. Implemented in `fetchYouTubeChannelVideoIds` (`src/lib/scrape.ts`).

For Instagram and TikTok, the platform-specific endpoints we use cap out below the sync limit, so 200 is mostly a YouTube ceiling.

## Files

- `src/scripts/sync-channels.ts` — The sync script
- `src/actions/submit-url.ts` — User-facing submission (50 video limit)
- `src/lib/scrape.ts` — All scraping logic (shared between both)
- `docs/channel-sync.md` — This file
