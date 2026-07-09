import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio, GeminiKeyError } from "@/lib/comics";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // 25 MB — plenty for a short recording.

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data." },
      { status: 400 },
    );
  }

  const audio = form.get("audio");
  if (!(audio instanceof File)) {
    return NextResponse.json({ error: "No audio provided." }, { status: 400 });
  }
  if (audio.size === 0) {
    return NextResponse.json({ error: "Empty recording." }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "Recording is too long. Keep it under ~2 minutes." },
      { status: 413 },
    );
  }

  try {
    const bytes = Buffer.from(await audio.arrayBuffer());
    const mimeType = audio.type || "audio/webm";
    const text = await transcribeAudio(bytes, mimeType);
    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof GeminiKeyError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("Transcription failed:", err);
    return NextResponse.json(
      { error: "Could not transcribe the audio. Please try again or type instead." },
      { status: 500 },
    );
  }
}
