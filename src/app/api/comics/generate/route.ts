import { NextRequest, NextResponse } from "next/server";
import {
  generateComic,
  ComicBlockedError,
  GeminiKeyError,
} from "@/lib/comics";

export const runtime = "nodejs";
export const maxDuration = 120; // Nano Banana image generation can take a while.

export async function POST(req: NextRequest) {
  let prompt = "";
  try {
    const body = await req.json();
    prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (prompt.length < 10) {
    return NextResponse.json(
      {
        error:
          "Describe your story in a bit more detail — include the setting, what happened, and any quotes.",
      },
      { status: 400 },
    );
  }

  try {
    const { bytes, mimeType } = await generateComic(prompt);
    return NextResponse.json({
      image: `data:${mimeType};base64,${bytes.toString("base64")}`,
    });
  } catch (err) {
    if (err instanceof GeminiKeyError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    if (err instanceof ComicBlockedError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("Comic generation failed:", err);
    return NextResponse.json(
      { error: "Something went wrong generating the comic. Please try again." },
      { status: 500 },
    );
  }
}
