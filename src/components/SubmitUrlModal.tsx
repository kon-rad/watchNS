"use client";

import { useState } from "react";
import { submitUrl } from "@/actions/submit-url";

export default function SubmitUrlModal({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const result = await submitUrl(url.trim());

    if (result.success) {
      setStatus("success");
      setTimeout(() => onClose(), 1500);
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">
          Add Your Links
        </h2>
        <p className="text-on-surface-variant text-sm mb-6">
          Paste a YouTube, TikTok, or Instagram video or channel URL.
        </p>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tertiary/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff97b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-on-surface font-bold">Added successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 border-none rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              autoFocus
              disabled={status === "loading"}
            />
            {status === "error" && (
              <p className="text-error text-sm mt-2">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading" || !url.trim()}
              className="w-full mt-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed py-4 rounded-full font-bold text-base transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Processing..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
