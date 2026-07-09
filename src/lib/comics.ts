import {
  GoogleGenAI,
  createPartFromBase64,
  createPartFromText,
  type GenerateContentResponse,
} from "@google/genai";

// Ported from the `comic-strip-maker` skill (scripts/generate_comic_strip.py).
// Two-step Gemini pipeline: Gemini 2.5 Flash expands the user's story into a single
// detailed comic image prompt, then Nano Banana Pro renders one 4-panel comic image.

const GEMINI_TEXT_MODEL = "gemini-2.5-flash";
const NANO_BANANA_MODEL = "nano-banana-pro-preview";

// NS comic template — baked in so every comic shares the Network School look.
const PANELS = 4;
const ASPECT_RATIO = "1:1"; // 2x2 grid reads well square

const NS_ART_STYLE =
  "Modern anime art style with clean crisp lines, vibrant saturated colors, cel-shading, " +
  "expressive faces, and dynamic poses. High-quality anime illustration.";

const NS_SETTING =
  'This is a "Network School" (NS) comic. Network School is a real tech-founder community and ' +
  "startup campus in Forest City, Malaysia — a sunny beachside high-rise campus where ambitious " +
  "founders, software developers, crypto builders, and digital nomads live, work out, and build " +
  "startups together. The vibe is energetic, optimistic tech-startup culture: laptops and " +
  "whiteboards, a gym, a pool, palm trees, the beach, and modern co-working spaces.";

/** Thrown when the Gemini API key is missing or invalid. Maps to a 500 with a clear message. */
export class GeminiKeyError extends Error {
  constructor(
    message = "GEMINI_API_KEY is not set on the server. The comic generator is disabled until it is configured.",
  ) {
    super(message);
    this.name = "GeminiKeyError";
  }
}

/** Rethrow Gemini API auth failures as {@link GeminiKeyError} so routes can surface a clear message. */
function rethrowGeminiError(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  if (/API_KEY_INVALID|API key not valid|PERMISSION_DENIED|401|403/i.test(msg)) {
    throw new GeminiKeyError(
      "The Gemini API key is invalid or not authorized for the Generative Language API. Check GEMINI_API_KEY.",
    );
  }
  throw err;
}

/** Thrown when the image model returns no image (usually a safety-filter block). Maps to 422. */
export class ComicBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ComicBlockedError";
  }
}

let client: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new GeminiKeyError();
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

// NOTE: we deliberately do NOT attach the NS plus-logo as an image reference. The
// comic-strip-maker skill warns that a plus/cross logo gets misread as the Swiss flag
// and hijacks the whole scene. NS branding is described in text instead (see below).

/**
 * Step 1 — Gemini 2.5 Flash turns the user's story into a single, detailed Nano Banana
 * prompt describing a 4-panel NS comic (layout, per-panel action, speech bubbles, style).
 */
export async function buildComicPrompt(story: string): Promise<string> {
  const ai = getGeminiClient();

  const analysisPrompt = `You are an expert comic artist and storyboard designer. Write ONE detailed image-generation prompt that produces a single comic page.

${NS_SETTING}

STORY / SCRIPT (from the user — setting, events, what people said, and quotes). The comic MUST depict THIS story and its specific characters, actions, and quotes — do not invent an unrelated scene:
${story}

LAYOUT: A 4-panel comic arranged in a 2x2 grid. Clear panel borders with gutters between panels. Reads left-to-right, top-to-bottom.

ART STYLE:
${NS_ART_STYLE}

Your output must be a SINGLE image-generation prompt (100-200 words) that:
1. Describes the 2x2 four-panel layout explicitly.
2. Describes each of the 4 panels: setting, character positions, expressions, and action, following the story's beats in order. Stay faithful to the user's story above.
3. Includes speech bubbles with SHORT dialogue (3-8 words each). Use the user's actual quotes where given.
4. Keeps characters visually consistent across panels (same hair, outfit, distinctive features).
5. Applies the Network School vibe and the art style above.
6. NS branding should be SUBTLE and text-based only — e.g. the letters "NS" on a laptop sticker, a lanyard, a t-shirt, or a wall sign. Do NOT draw any national flag, and do NOT make a plus/cross symbol the focus of any panel.
7. FULL COLOR. ALL TEXT IN ENGLISH.

Output ONLY the image prompt. No headers, explanations, or metadata. Start directly with the visual description.`;

  let response: GenerateContentResponse;
  try {
    response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [createPartFromText(analysisPrompt)],
      config: {
        temperature: 0.8,
        maxOutputTokens: 1500,
        // gemini-2.5-flash is a thinking model; its reasoning tokens count against
        // maxOutputTokens. Leaving thinking on truncated the prompt into a generic
        // stub, so the comic ignored the story. Disable it — we just want the prompt.
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
  } catch (err) {
    rethrowGeminiError(err);
  }

  const prompt = response.text?.trim();
  if (!prompt) {
    throw new Error("Gemini did not return a comic prompt.");
  }
  return prompt;
}

/** A rendered comic image: raw bytes plus the MIME type the model returned (jpeg or png). */
export interface ComicImage {
  bytes: Buffer;
  mimeType: string;
}

/**
 * Step 2 — Nano Banana Pro renders the full 4-panel comic as one image.
 * Returns the image bytes and their MIME type. Throws {@link ComicBlockedError}
 * if no image comes back (usually a safety-filter block).
 */
export async function generateComicImage(prompt: string): Promise<ComicImage> {
  const ai = getGeminiClient();

  let response: GenerateContentResponse;
  try {
    response = await ai.models.generateContent({
      model: NANO_BANANA_MODEL,
      contents: [createPartFromText(prompt)],
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: ASPECT_RATIO },
      },
    });
  } catch (err) {
    rethrowGeminiError(err);
  }

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const data = part.inlineData?.data;
    if (data) {
      return {
        bytes: Buffer.from(data, "base64"),
        mimeType: part.inlineData?.mimeType || "image/png",
      };
    }
  }

  throw new ComicBlockedError(
    "No image was generated — the prompt may have been blocked by safety filters. Try rephrasing your story.",
  );
}

/** Generate a full NS comic from a user story: build the prompt, then render the image. */
export async function generateComic(story: string): Promise<ComicImage> {
  const imagePrompt = await buildComicPrompt(story);
  return generateComicImage(imagePrompt);
}

/** Transcribe recorded audio to text with Gemini 2.5 Flash (same API key). */
export async function transcribeAudio(
  audio: Buffer,
  mimeType: string,
): Promise<string> {
  const ai = getGeminiClient();

  let response: GenerateContentResponse;
  try {
    response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [
        createPartFromBase64(audio.toString("base64"), mimeType),
        createPartFromText(
          "Transcribe this audio verbatim into plain English text. Output only the transcript — no commentary, labels, or timestamps.",
        ),
      ],
      config: { temperature: 0 },
    });
  } catch (err) {
    rethrowGeminiError(err);
  }

  return response.text?.trim() ?? "";
}

export const COMIC_CONFIG = { PANELS, ASPECT_RATIO } as const;
