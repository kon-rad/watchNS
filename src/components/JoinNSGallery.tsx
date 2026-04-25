"use client";

import { useEffect, useState, useCallback } from "react";

export default function JoinNSGallery({ count }: { count: number }) {
  const indices = Array.from({ length: count }, (_, i) => i + 1);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [fullLoaded, setFullLoaded] = useState(false);

  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(() => {
    setFullLoaded(false);
    setOpenIdx((i) => (i === null ? null : (i % count) + 1));
  }, [count]);
  const prev = useCallback(() => {
    setFullLoaded(false);
    setOpenIdx((i) => (i === null ? null : ((i - 2 + count) % count) + 1));
  }, [count]);

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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-2">
        {indices.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setFullLoaded(false);
              setOpenIdx(i);
            }}
            aria-label={`Open photo ${i}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container-high cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/join-ns/ns-pic-${i}-thumb.jpg`}
              alt={`Network School moment ${i}`}
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.06] group-active:scale-[0.98]"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5 rounded-xl" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Network School photo ${openIdx} of ${count}`}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white hover:bg-white/20 transition-all flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white hover:bg-white/20 transition-all flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white hover:bg-white/20 transition-all flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blurred low-res preview while full loads */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/join-ns/ns-pic-${openIdx}-thumb.jpg`}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-contain blur-xl scale-105 transition-opacity duration-300 ${fullLoaded ? "opacity-0" : "opacity-70"}`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={openIdx}
              src={`/join-ns/ns-pic-${openIdx}.jpg`}
              alt={`Network School moment ${openIdx}`}
              onLoad={() => setFullLoaded(true)}
              className={`relative max-w-[92vw] max-h-[85vh] object-contain rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)] transition-opacity duration-500 ${fullLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-bold tracking-widest uppercase text-white/80">
            {openIdx} / {count}
          </div>
        </div>
      )}
    </>
  );
}
