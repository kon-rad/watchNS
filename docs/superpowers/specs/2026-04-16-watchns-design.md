# WatchNS — Design Specification

## Overview

WatchNS is a mobile-first Next.js web app that showcases social media videos from Network School members. Users discover videos through a Tinder-like swipe experience, save favorites, and submit their own video/channel links. No authentication — anonymous users are identified via browser cookie.

## Architecture

- **Framework:** Next.js 15 (App Router, Server Actions, middleware)
- **Database:** SQLite via better-sqlite3 + Drizzle ORM
- **Styling:** Tailwind CSS 4 with "Editorial Energy" design system (deep-violet foundation, glassmorphism, gradient CTAs)
- **Fonts:** Plus Jakarta Sans (headlines), Be Vietnam Pro (body)
- **Video Embeds:** react-player (YouTube, TikTok, generic)
- **Swipe Gestures:** react-swipeable

## Design System

Fully defined in `designs/stitch_watchns_video_swiper/prism_flow/DESIGN.md`. Key tokens:

- Surface base: `#16052a`
- Primary: `#b89fff` → `#8254f4` (gradient)
- Tertiary (energy): `#ff97b8`
- On-surface text: `#f1dfff`
- No 1px borders — use background color shifts
- No drop shadows — use ambient glows
- Corner radii: min 1rem, videos 2-3rem

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT (UUID) | PK, matches cookie value |
| created_at | INTEGER | Unix timestamp |

### creators
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, auto-increment |
| name | TEXT | Scraped or derived from URL |
| avatar_url | TEXT | Nullable, scraped |
| platform | TEXT | "youtube", "tiktok", "instagram" |
| channel_url | TEXT | Link to their main channel |
| created_at | INTEGER | Unix timestamp |

### videos
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, auto-increment |
| creator_id | INTEGER | FK → creators.id |
| url | TEXT | Original submitted URL |
| embed_url | TEXT | Nullable, resolved embed URL |
| platform | TEXT | "youtube", "tiktok", "instagram" |
| title | TEXT | Nullable, scraped |
| thumbnail_url | TEXT | Nullable, scraped |
| like_count | INTEGER | Default 0, denormalized |
| created_at | INTEGER | Unix timestamp |

### favorites
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, auto-increment |
| user_id | TEXT | FK → users.id |
| video_id | INTEGER | FK → videos.id |
| created_at | INTEGER | Unix timestamp |
| | | UNIQUE(user_id, video_id) |

## Pages & Routes

### `/` — Landing Page
- Hero section with "Watch Now" button → `/swipe`
- "Add Your Links" button in navbar opens submit popup (modal)
- Featured communities / curated stories sections
- Bottom nav: Home (active), Swipe, Favorites

### `/swipe` — Swipe Discovery View
- Full-screen card stack, one video at a time
- Swipe right → favorite (insert into favorites, increment like_count)
- Swipe left → skip (client-side only, not persisted)
- Play button → plays video embed inline via react-player
- "Watch on [platform]" link-out in bottom-right corner
- Creator avatar + name, title, like count on card overlay
- Prefetch next batch when 3 cards remaining
- Bottom nav: Home, Swipe (active), Favorites

### `/favorites` — Favorites List
- Bento grid layout showing all liked videos
- Each card: thumbnail, title, creator name, play button
- Tapping card → `/video/[id]`
- Bottom nav: Home, Swipe, Favorites (active)

### `/video/[id]` — Video Detail Page
- Full video embed player
- Creator info (name, avatar, channel link)
- Global like count
- Favorite/unfavorite toggle
- "Watch on [platform]" link-out bottom-right
- Back navigation

### Submit URL Popup (modal, any page)
- Single text input for URL
- Server Action: parse URL → detect platform → scrape via oEmbed → create creator + video records
- Success confirmation then close

## URL Submission & Scraping

### Platform Detection (URL parsing)
- `youtube.com/watch`, `youtu.be/`, `youtube.com/shorts/` → YouTube video
- `tiktok.com/@user/video/` → TikTok video
- `instagram.com/reel/`, `instagram.com/p/` → Instagram video
- `youtube.com/@channel`, `youtube.com/c/` → YouTube channel
- `tiktok.com/@user` (no /video/) → TikTok channel
- Anything else → reject with "Unsupported platform"

### Scraping (best-effort, no manual fallback)
- **YouTube:** `https://www.youtube.com/oembed?url=` — free, no API key
- **YouTube channels:** Scrape page `<meta>` tags (og:title, og:image)
- **TikTok:** `https://www.tiktok.com/oembed?url=`
- **Instagram:** `https://graph.facebook.com/v18.0/instagram_oembed?url=` — requires Meta app token, may fail

### Failure mode
If scraping fails, save URL + platform with null metadata. Embed will still work. No error shown to user.

### Upsert Logic
- Find or create creator by channel_url + platform
- If video URL → create video row linked to creator
- If channel URL → create/update creator row only

## Swipe Mechanics

### Card Loading
- Fetch 10 unseen videos on mount (not in favorites, not in client-side seenSet)
- Prefetch next 10 when 3 remaining
- seenSet is client-side React state (resets on page reload — users can re-encounter skipped videos next session)

### Interaction
- react-swipeable for touch/mouse gestures
- 100px horizontal drag threshold
- During drag: card rotates, "Skip"/"Fav" labels fade in
- Release past threshold: card animates off-screen
- Tap buttons below card as alternative to swiping

### Favorite (swipe right)
- Server Action: insert favorites row, increment videos.like_count
- Optimistic UI — card flies off immediately

### Skip (swipe left)
- No server call — add to client-side seenSet, advance

### Playback
- Tap play → react-player loads embed inline
- Swipe gestures disabled during playback
- Tap close → stop playback, re-enable swiping

### Empty State
- "You've seen everything!" with link to /favorites

## Anonymous User Identity

- Next.js middleware on every request
- Check for `watchns_uid` httpOnly cookie
- Missing → generate UUID v4, set cookie (path=/, sameSite=lax, maxAge=1 year), upsert users row
- Present → proceed
- Server Actions read user from `cookies()` — no prop drilling

## Dependencies

### Core
- next 15, react 19, react-dom 19, typescript

### Database
- better-sqlite3, drizzle-orm, drizzle-kit

### UI
- tailwindcss 4
- @fontsource/plus-jakarta-sans, @fontsource/be-vietnam-pro

### Video & Interaction
- react-player, react-swipeable

### Utilities
- uuid

### No
- No state management library
- No CSS-in-JS
- No auth library
- No API client
