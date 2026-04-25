import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-outline-variant/20 bg-surface-container-low/40">
      {/* Big Join NS CTA */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-tertiary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-4">
            Limited Time
          </p>
          <a
            href="https://ns.com/invite/konradgnat"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-black font-headline tracking-tighter">
              <span className="text-on-surface">Join NS with</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
                1 Week Free
              </span>
            </h2>
            <p className="mt-3 text-lg text-on-surface-variant max-w-2xl mx-auto">
              Use my invite link for a free week at the world&apos;s most exciting
              network state campus.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold shadow-[0_0_60px_rgba(184,159,255,0.35)] group-hover:scale-105 transition-transform">
              Claim Your Free Week
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </a>
          <Link
            href="/join-ns"
            className="block mt-4 text-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Or learn what makes NS unbeatable →
          </Link>
        </div>
      </div>

      {/* Links + credit */}
      <div className="border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span>made with</span>
            <span
              className="text-tertiary text-base animate-pulse"
              aria-label="love"
            >
              ♥
            </span>
            <span>by</span>
            <span className="font-bold text-on-surface">Konrad Gnat</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <a
              href="https://konradgnat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm font-bold text-tertiary border border-tertiary/40 rounded-full hover:bg-tertiary hover:text-on-tertiary-fixed transition-colors"
            >
              Hire Me
            </a>
            <FooterIconLink
              href="https://linkedin.com/in/konrad-gnat"
              label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.18V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </FooterIconLink>
            <FooterIconLink
              href="https://x.com/konrad_gnat"
              label="X (Twitter)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </FooterIconLink>
            <FooterIconLink
              href="https://instagram.com/konradgnat"
              label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </FooterIconLink>
            <Link
              href="/join-ns"
              className="px-3 py-1.5 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Join NS
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all hover:scale-110"
    >
      {children}
    </a>
  );
}
