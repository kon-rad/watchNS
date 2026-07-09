"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PLACEHOLDER = `Describe your NS story — the more detail, the better the comic:

• Setting: Where does it happen? (the NS gym, the co-working floor, the beach, a demo day...)
• Events: What happened, step by step?
• People: Who's there and what are they doing?
• Quotes: The exact lines people said

e.g. "At Monday standup on the co-working floor, Kai pitches his AI startup. Priya raises an eyebrow and says 'Ship it or skip it.' Kai deploys live — it works — and the whole room cheers."`;

type MicState = "idle" | "recording" | "transcribing";

export default function ComicsClient() {
  const [prompt, setPrompt] = useState("");
  const [micState, setMicState] = useState<MicState>("idle");
  const [generating, setGenerating] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up any live mic stream on unmount.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const transcribe = useCallback(async (blob: Blob) => {
    setMicState("transcribing");
    setError(null);
    try {
      const form = new FormData();
      form.append("audio", blob, "recording.webm");
      const res = await fetch("/api/comics/transcribe", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Transcription failed.");
      const text = (data?.text || "").trim();
      if (text) {
        setPrompt((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed.");
    } finally {
      setMicState("idle");
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Voice input isn't supported in this browser. Please type your story.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (blob.size > 0) void transcribe(blob);
        else setMicState("idle");
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setMicState("recording");
    } catch {
      setError(
        "Microphone access was denied. Enable it in your browser, or type your story instead.",
      );
      setMicState("idle");
    }
  }, [transcribe]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    // onstop transitions state to "transcribing".
  }, []);

  const toggleMic = useCallback(() => {
    if (micState === "recording") stopRecording();
    else if (micState === "idle") void startRecording();
  }, [micState, startRecording, stopRecording]);

  const generate = useCallback(async () => {
    if (prompt.trim().length < 10) {
      setError("Add a bit more detail to your story before generating.");
      return;
    }
    setGenerating(true);
    setError(null);
    setImage(null);
    try {
      const res = await fetch("/api/comics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Generation failed.");
      setImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }, [prompt]);

  const micBusy = micState !== "idle";

  return (
    <section className="relative px-6 max-w-4xl mx-auto py-12">
      {/* Decorative glows */}
      <div className="absolute -top-10 right-0 w-56 h-56 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-40 -left-20 w-64 h-64 bg-tertiary/10 blur-[110px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-tertiary border border-outline-variant/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
          </svg>
          <span className="text-xs font-bold tracking-widest uppercase">
            NS Comic Studio
          </span>
        </div>
        <h1 className="mt-6 text-[clamp(2.5rem,7vw,4rem)] leading-[0.95] font-black font-headline tracking-tighter text-on-surface">
          Turn your NS story into a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
            comic
          </span>
          .
        </h1>
        <p className="mt-4 text-lg text-on-surface-variant font-body">
          Describe the setting, what happened, and what people said — speak it or type
          it — and we&apos;ll draw a four-panel Network School comic you can download.
        </p>
      </div>

      {/* Prompt card */}
      <div className="relative z-10 mt-10 bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6 sm:p-8">
        <label htmlFor="comic-prompt" className="block text-sm font-bold text-on-surface mb-3 font-headline">
          Your story
        </label>
        <textarea
          id="comic-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={9}
          disabled={generating}
          className="w-full resize-y rounded-xl bg-surface-container-highest/60 border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 px-4 py-3 text-base leading-relaxed font-body focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-shadow disabled:opacity-60"
        />

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Mic button */}
          <button
            type="button"
            onClick={toggleMic}
            disabled={generating || micState === "transcribing"}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all active:scale-95 disabled:opacity-60 ${
              micState === "recording"
                ? "bg-error text-on-error animate-pulse"
                : "bg-surface-container-high text-on-surface hover:bg-surface-bright/50"
            }`}
            aria-pressed={micState === "recording"}
          >
            {micState === "transcribing" ? (
              <>
                <Spinner /> Transcribing…
              </>
            ) : micState === "recording" ? (
              <>
                <StopIcon /> Stop &amp; add
              </>
            ) : (
              <>
                <MicIcon /> Speak your story
              </>
            )}
          </button>

          {/* Generate button */}
          <button
            type="button"
            onClick={generate}
            disabled={generating || micBusy || prompt.trim().length < 10}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-8 py-3 rounded-full font-bold text-base shadow-[0_0_40px_rgba(184,159,255,0.2)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {generating ? (
              <>
                <Spinner /> Drawing your comic…
              </>
            ) : (
              <>
                <SparkleIcon /> Generate comic
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-error font-medium" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Result */}
      {generating && (
        <div className="relative z-10 mt-8 aspect-square w-full rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Spinner large />
          </div>
          <p className="text-on-surface-variant font-body">
            Composing four panels… this takes ~20–40 seconds.
          </p>
        </div>
      )}

      {image && !generating && (
        <div className="relative z-10 mt-8">
          <div className="rounded-2xl overflow-hidden border border-outline-variant/20 editorial-shadow bg-surface-container-lowest">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Generated Network School comic" className="w-full h-auto block" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <a
              href={image}
              download={`ns-comic.${image.startsWith("data:image/jpeg") ? "jpg" : "png"}`}
              className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-8 py-3 rounded-full font-bold text-base hover:scale-105 transition-transform active:scale-95"
            >
              <DownloadIcon /> Download comic
            </a>
            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="flex items-center gap-2 bg-surface-container-high text-on-surface px-8 py-3 rounded-full font-bold text-base hover:bg-surface-bright/50 transition-colors active:scale-95"
            >
              <RegenIcon /> Regenerate
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Spinner({ large = false }: { large?: boolean }) {
  const size = large ? 28 : 16;
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RegenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
