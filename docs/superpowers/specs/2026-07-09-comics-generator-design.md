# NS Comic Generator — `/comics`

**Date:** 2026-07-09
**Status:** Approved, implementing

## Goal

A new `/comics` page on WatchNS that lets users generate a four-panel Network School
comic from a text prompt. Users describe a story (setting, events, what people said,
quotes); a mic button transcribes speech into the prompt box; a Generate button produces
a single 4-panel comic image in a consistent NS style, which the user can view and download.

Ports the standalone `comic-strip-maker` skill (Python + Gemini) into the Next.js app,
reusing the same Gemini API key and the same models (Gemini 2.5 Flash for prompt-building,
`nano-banana-pro-preview` / Nano Banana Pro for image generation).

## Decisions (locked)

- **Speech-to-text:** Gemini audio transcription. Record in-browser, POST audio to a
  server route, transcribe with Gemini 2.5 Flash (the same `GEMINI_API_KEY`). No second
  vendor/key.
- **NS theme:** A single default style baked into the server code. Users cannot change it.
- **Persistence:** Ephemeral. Generate → display → download. Nothing stored server-side,
  no DB schema change.

## Architecture

Route handlers (not server actions) because we move binary payloads: audio in, PNG out.

### `src/lib/comics.ts` (shared server lib)
- `getGeminiClient()` — constructs a `@google/genai` `GoogleGenAI` client from
  `process.env.GEMINI_API_KEY`; throws a clear error if unset.
- NS theme constants (setting cues, art style, layout, panel count, aspect ratio).
- `NANO_BANANA_MODEL = "nano-banana-pro-preview"`, `GEMINI_TEXT_MODEL = "gemini-2.5-flash"`.
- `buildComicPrompt(story: string): Promise<string>` — Gemini 2.5 Flash expands the user's
  story into ONE detailed comic image prompt, with the NS theme injected and the NS logo
  passed as a logo reference (read from `public/ns-logo.png`).
- `generateComicImage(prompt: string): Promise<Buffer>` — Nano Banana Pro renders one image
  (2×2 grid, 4 panels, aspect `1:1`), with the NS logo passed as a reference. Returns PNG
  bytes. Throws "blocked" if the response contains no image part (safety filter).
- `transcribeAudio(bytes, mimeType): Promise<string>` — Gemini 2.5 Flash transcribes audio
  verbatim.

New dependency: `@google/genai` (Node SDK equivalent of the Python `google-genai`).

### `POST /api/comics/transcribe` (`runtime = "nodejs"`)
- Accepts the recorded audio blob (multipart form-data, field `audio`).
- Calls `transcribeAudio` → returns `{ text }`.

### `POST /api/comics/generate` (`runtime = "nodejs"`)
- Accepts JSON `{ prompt }`. Validates non-empty / min length.
- `buildComicPrompt` → `generateComicImage` → returns `{ image: "data:image/png;base64,..." }`.
- Errors: missing key → 500 clear message; safety block → 422 "blocked"; other → 500.

### NS theme details (baked in)
- Setting: Network School / Forest City Malaysia campus energy; tech-founder community vibe.
- Branding: described in TEXT only ("NS" lettering on a shirt/laptop/sign). We do NOT
  attach `ns-logo.png` as an image reference — the plus/cross logo gets misread as the
  Swiss flag and hijacks the whole comic (the skill docs warn about this; confirmed in
  testing). Prompt explicitly forbids drawing a national flag.
- Style: `modern-anime` (clean lines, vibrant colors, cel-shading).
- Layout: 4 panels in a 2×2 grid, aspect ratio `1:1`, reads left-to-right, top-to-bottom.

### Gotcha: Gemini 2.5 Flash thinking budget
`gemini-2.5-flash` is a thinking model; reasoning tokens count against `maxOutputTokens`.
With the default budget the comic prompt was truncated to a generic stub and the image
ignored the story. Fix: `thinkingConfig: { thinkingBudget: 0 }` + `maxOutputTokens: 1500`
on the prompt-builder call. The image MIME type (jpeg or png) is read from the response
and carried through the data URL and download filename rather than hardcoded.

## Page: `src/app/comics/page.tsx` + `ComicsClient.tsx`

Client component, styled with existing Material tokens (`surface`, `primary`, `secondary`,
`tertiary`, `font-headline` / `font-body`), consistent with the hero aesthetic.

1. Intro header (headline + one-line description).
2. **Prompt textarea** with a structured placeholder guiding: *setting · events · what
   people said · quotes*.
3. **Mic button** — `MediaRecorder` records audio; on stop, POST to `/api/comics/transcribe`;
   append returned text to the textarea. States: idle / recording / transcribing / denied.
4. **Generate button** — POST to `/api/comics/generate`; loading state; render the returned
   image in a framed card. States: idle / generating / done / blocked / error.
5. **Download button** — client-side `<a download="ns-comic.png" href={dataUrl}>`.

## Navigation wiring (4 places)

- `TopNav.tsx` — add `Comics` to the desktop link row (`hidden md:flex`).
- `BottomNav.tsx` — add a `Comics` item (with an icon) to the mobile bar.
- `Footer.tsx` — add `Comics` to the footer nav row.
- `app/page.tsx` hero — add a secondary CTA "Make a Comic" → `/comics` next to "Watch Now".

## Ops

`GEMINI_API_KEY` must be set server-side: `.env.local` locally, and in the pm2 environment
on the droplet. The feature is inert (clear 500) without it. Flag this at deploy time.

## Out of scope (YAGNI)

Storage/gallery, per-generation style selection, reference-image upload, auth/rate limiting.
Can be added later if needed.
