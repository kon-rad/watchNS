# WatchNS

A mobile-first web app for discovering and watching social media videos from Network School members. Swipe through videos Tinder-style, save your favorites, and submit new creator links.

## Features

- **Swipe Discovery** — Tinder-like card stack for browsing videos. Swipe right to favorite, left to skip. Tap to play inline.
- **Favorites** — Bento grid of all your liked videos, persisted via browser cookie.
- **Submit Links** — Paste a YouTube, TikTok, or Instagram URL. Channel links auto-import the top 10 videos. Video links add a single video.
- **Video Detail** — Full embed player with creator info, global like count, and favorite toggle.
- **No Auth Required** — Anonymous users identified by a browser cookie (UUID). No signup, no login.

## Tech Stack

- **Next.js 15** — App Router, Server Actions, middleware
- **SQLite** via better-sqlite3 + **Drizzle ORM**
- **Tailwind CSS 4** — Custom "Editorial Energy" design system
- **react-player** — Unified video embeds (YouTube, TikTok, Instagram)
- **react-swipeable** — Touch/mouse swipe gestures
- **TypeScript**

## Getting Started

```bash
# Install dependencies
npm install

# Create database and run migrations
npm run db:push

# Seed sample data
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:push` | Push schema to SQLite database |
| `npm run db:seed` | Seed sample creators and videos |

## Database

SQLite database stored at `watchns.db` in the project root. Four tables:

- **users** — Anonymous browser-identified users (UUID from cookie)
- **creators** — Content creators with name, avatar, platform, channel URL
- **videos** — Video entries with embed URL, title, thumbnail, like count
- **favorites** — Join table linking users to their favorited videos

## How It Works

1. **Submit a link** — Click "Add Your Links" in the navbar. Paste a YouTube/TikTok/Instagram URL.
   - Video URL: scrapes metadata via oEmbed, creates creator + video record
   - Channel URL: scrapes the channel page for the top 10 video URLs, fetches metadata for each, and adds them all
2. **Swipe** — Navigate to `/swipe`. Videos appear as full-screen cards. Swipe right or tap the heart to favorite. Swipe left or tap X to skip.
3. **Favorites** — Navigate to `/favorites` to see all your liked videos in a bento grid. Tap any card to view the full video detail page.

## Design System

Built on the "Editorial Energy" design system — a deep-violet dark theme with glassmorphism, gradient CTAs, and ambient glows. No borders, no drop shadows. Key tokens:

- Surface: `#16052a`
- Primary: `#b89fff` to `#8254f4`
- Tertiary (energy): `#ff97b8`
- Fonts: Plus Jakarta Sans (headlines), Be Vietnam Pro (body)

Full design spec in `designs/stitch_watchns_video_swiper/prism_flow/DESIGN.md`.

## License

MIT
