"use client";

import { useState } from "react";

export default function ExpandableDetails({
  title = "Details",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-outline-variant/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer"
      >
        <span className="font-headline font-bold text-on-surface text-sm">
          {title}
        </span>
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
          className={`text-on-surface-variant transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-5 py-4 bg-surface-container-lowest space-y-3 text-sm">
          {children}
        </div>
      )}
    </div>
  );
}
