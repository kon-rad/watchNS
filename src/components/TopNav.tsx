"use client";

import Link from "next/link";
import { useState } from "react";
import SubmitUrlModal from "./SubmitUrlModal";

export default function TopNav() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-black text-on-surface tracking-tighter font-headline">
            WatchNS
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-on-surface font-headline tracking-tight font-bold hover:bg-surface-bright/40 transition-colors px-3 py-1 rounded-md"
          >
            Home
          </Link>
          <Link
            href="/swipe"
            className="text-on-surface font-headline tracking-tight font-bold hover:bg-surface-bright/40 transition-colors px-3 py-1 rounded-md"
          >
            Swipe
          </Link>
          <Link
            href="/favorites"
            className="text-on-surface font-headline tracking-tight font-bold hover:bg-surface-bright/40 transition-colors px-3 py-1 rounded-md"
          >
            Favorites
          </Link>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-5 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Add Your Links
        </button>
      </nav>
      {showModal && <SubmitUrlModal onClose={() => setShowModal(false)} />}
    </>
  );
}
