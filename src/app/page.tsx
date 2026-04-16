import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 min-h-[80vh] py-12">
        <div className="lg:w-7/12 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-tertiary border border-outline-variant/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span className="text-xs font-bold tracking-widest uppercase">
              The Kinetic Campus
            </span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,5rem)] leading-[0.9] font-black font-headline tracking-tighter text-on-surface">
            Experience the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
              Pulse
            </span>{" "}
            of Your School.
          </h1>
          <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed font-body">
            WatchNS captures the rhythmic energy of the Network School community.
            A curated yearbook of high-impact social videos, featured stories, and
            viral moments.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/swipe"
              className="bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold shadow-[0_0_40px_rgba(184,159,255,0.2)] hover:scale-105 transition-transform"
            >
              Watch Now
            </Link>
          </div>
        </div>
        <div className="lg:w-5/12 relative">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden editorial-shadow transform rotate-3">
            <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            {/* Floating Card */}
            <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-on-tertiary-fixed">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-tertiary">
                    Trending Now
                  </p>
                  <p className="font-bold text-on-surface">
                    Community Highlights
                  </p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-tertiary rounded-full" />
              </div>
            </div>
          </div>
          {/* Decorative glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-tertiary/10 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 px-6 max-w-7xl mx-auto pb-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface">
              Curated Stories
            </h2>
            <p className="text-on-surface-variant mt-2">
              Beyond the feed. Intentional energy.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col justify-between min-h-[250px]">
            <div>
              <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase rounded-full">
                Discover
              </span>
              <h3 className="text-2xl font-black mt-4 leading-tight font-headline">
                Swipe to Watch
              </h3>
            </div>
            <p className="text-on-surface-variant">
              A Tinder-like experience for discovering the best NS content.
            </p>
          </div>
          <div className="bg-surface-container-high p-8 rounded-2xl">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 font-headline">Save Favorites</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Build your personal collection of the best community videos.
            </p>
          </div>
          <div className="bg-surface-container-highest p-8 rounded-2xl">
            <div className="w-12 h-12 bg-tertiary/20 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-tertiary">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 font-headline">Community Hub</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Connect with peers through shared visual experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
