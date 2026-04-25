"use client";

import { useEffect, useState, useCallback } from "react";

export default function JoinNSGallery({ count }: { count: number }) {
  const indices = Array.from({ length: count }, (_, i) => i + 1);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i % count) + 1)),
    [count],
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : ((i - 2 + count) % count) + 1)),
    [count],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx, close, next, prev]);

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 [column-fill:_balance]">
        {indices.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="block w-full mb-3 sm:mb-4 break-inside-avoid rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-tertiary/20 group cursor-zoom-in border border-outline-variant/15 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(184,159,255,0.25)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/join-ns/ns-pic-${i}-thumb.jpg`}
              alt={`Network School moment ${i}`}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Network School photo ${openIdx} of ${count}`}
          className="fixed inset-0 z-[100] bg-surface/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-up"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-surface-container-high/80 backdrop-blur border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest hover:scale-110 transition-all flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-high/80 backdrop-blur border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest hover:scale-110 transition-all flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-high/80 backdrop-blur border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest hover:scale-110 transition-all flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/join-ns/ns-pic-${openIdx}.jpg`}
            alt={`Network School moment ${openIdx}`}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-surface-container-high/80 backdrop-blur border border-outline-variant/30 text-xs font-bold tracking-widest uppercase text-on-surface-variant">
            {openIdx} / {count}
          </div>
        </div>
      )}
    </>
  );
}
