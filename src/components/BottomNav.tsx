"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/swipe", label: "Swipe", icon: "swipe" },
  { href: "/browse", label: "Browse", icon: "browse" },
  { href: "/favorites", label: "Favorites", icon: "heart" },
];

function NavIcon({ icon, filled }: { icon: string; filled: boolean }) {
  if (icon === "home") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        {!filled && <polyline points="9 22 9 12 15 12 15 22" />}
      </svg>
    );
  }
  if (icon === "swipe") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12l4-4m0 8l-4-4M22 12l-4-4m0 8l4-4" />
      </svg>
    );
  }
  if (icon === "browse") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    );
  }
  // heart
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-3 pt-2 bg-surface-container-low/60 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(184,159,255,0.15)]">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 ${
              isActive
                ? "bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed rounded-full"
                : "text-on-surface/60 hover:text-primary"
            }`}
          >
            <NavIcon icon={item.icon} filled={isActive} />
            <span className="font-label text-[9px] uppercase tracking-widest font-bold mt-0.5">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
