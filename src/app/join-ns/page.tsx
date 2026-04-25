import type { Metadata } from "next";
import Link from "next/link";

const INVITE_URL = "https://ns.com/invite/konradgnat";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&bgcolor=ffffff&color=37008e&data=${encodeURIComponent(INVITE_URL)}`;

export const metadata: Metadata = {
  title: "Join Network School — 1 Week Free | WatchNS",
  description:
    "5-star living, longevity-curated meals, 3 daily group workouts, 24/7 gyms, sauna, ice plunge, and a buzzing tech community 45 minutes from Singapore. Get your first week free with my invite.",
};

const heroImages = [
  { src: "/join-ns/hero-1.jpg", alt: "Network School campus" },
  { src: "/join-ns/hero-2.jpg", alt: "NS community life" },
  { src: "/join-ns/hero-3.jpg", alt: "NS beach view" },
];

const galleryImages = [
  { src: "/join-ns/gym.jpg", alt: "24/7 fitness facility" },
  { src: "/join-ns/sauna.jpg", alt: "Sauna and ice plunge" },
  { src: "/join-ns/cafe.jpg", alt: "Coworking cafe" },
  { src: "/join-ns/pool.jpg", alt: "Pool and pool bar" },
  { src: "/join-ns/beach.jpg", alt: "Private beach" },
  { src: "/join-ns/breakfast.jpg", alt: "5-star breakfast buffet" },
  { src: "/join-ns/workout.jpg", alt: "Group workout" },
  { src: "/join-ns/event.jpg", alt: "Community event" },
];

export default function JoinNSPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/15 blur-[160px] rounded-full animate-float-slow" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-tertiary/15 blur-[140px] rounded-full animate-float-slow" style={{ animationDelay: "-5s" }} />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-secondary/10 blur-[180px] rounded-full animate-float-slow" style={{ animationDelay: "-9s" }} />
      </div>

      {/* HERO */}
      <section className="relative px-6 max-w-7xl mx-auto pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary/15 text-tertiary border border-tertiary/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase">
                1 Week Free Invite
              </span>
            </div>

            <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[0.88] font-black font-headline tracking-tighter">
              <span className="text-on-surface">Live the</span>
              <br />
              <span className="shimmer-text">Network</span>
              <br />
              <span className="text-on-surface">School life.</span>
            </h1>

            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
              5-star living, longevity-curated meals, three daily group workouts,
              24/7 gyms, and a buzzing community of founders, creators, and
              crypto pioneers — 45 minutes from Singapore.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold animate-pulse-glow"
              >
                Claim Free Week
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
              </a>
              <a
                href="#why-ns"
                className="inline-flex items-center gap-2 px-8 py-5 rounded-full border border-outline-variant/40 text-on-surface font-bold hover:bg-surface-container-high transition-colors"
              >
                See What&apos;s Inside
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-on-surface-variant">
              <Stat label="Per month" value="$1.5k+" />
              <div className="w-px h-10 bg-outline-variant/30" />
              <Stat label="Meals daily" value="3" />
              <div className="w-px h-10 bg-outline-variant/30" />
              <Stat label="Workouts/day" value="3" />
            </div>
          </div>

          {/* QR + invite card */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-3xl rotate-3 animate-gradient" />
              <div className="absolute inset-0 bg-surface rounded-3xl -rotate-1" />
              <div className="relative bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl p-8 h-full flex flex-col items-center justify-center gap-4 editorial-shadow border border-outline-variant/20">
                <p className="text-xs font-bold tracking-[0.25em] uppercase text-tertiary">
                  Scan to Join
                </p>
                <div className="bg-white p-4 rounded-2xl shadow-2xl animate-float">
                  <img
                    src={QR_URL}
                    alt="QR code to join Network School"
                    width="240"
                    height="240"
                    className="w-60 h-60"
                  />
                </div>
                <p className="text-on-surface font-bold text-center">
                  ns.com/invite/<span className="text-primary">konradgnat</span>
                </p>
                <p className="text-xs text-on-surface-variant">
                  Includes 7 days free
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HERO PHOTO STRIP */}
      <section className="px-6 max-w-7xl mx-auto -mt-4 mb-24">
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {heroImages.map((img, i) => (
            <PhotoTile
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`aspect-[3/4] ${i === 1 ? "translate-y-6" : ""}`}
              delay={i * 0.1}
            />
          ))}
        </div>
      </section>

      {/* WHY NS — feature pillars */}
      <section id="why-ns" className="px-6 max-w-7xl mx-auto py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-4">
            Why Network School
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-black font-headline tracking-tighter">
            The most <span className="shimmer-text">unbeatable</span> deal in
            modern living.
          </h2>
          <p className="mt-6 text-lg text-on-surface-variant">
            Compare any 5-star resort, gym, longevity program, and coworking
            membership combined. Nothing comes close.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            tone="primary"
            kicker="Pricing"
            title="$1.5k–3k/month — all in"
            description="Shared room from $1,500/mo. Private room $3,000/mo. Includes housing, three meals daily, all amenities, gyms, pools, sauna, ice plunge, and 24/7 coworking."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
          />
          <FeatureCard
            tone="tertiary"
            kicker="Food"
            title="3 meals, longevity-curated"
            description="Five-star hotel breakfast buffet. Healthy lunch and dinner curated by Bryan Johnson for longevity and peak health. Eat well, every single day."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h2v11h2V11h2c1.1 0 2-.9 2-2V2H3z" />
                <path d="M19 2v20" />
                <path d="M19 2c-1.7 0-3 1.3-3 3v7h6V5c0-1.7-1.3-3-3-3z" />
              </svg>
            }
          />
          <FeatureCard
            tone="secondary"
            kicker="Fitness"
            title="3 group workouts daily"
            description="Sessions at 7am, 11am, and 5pm. Two fully-equipped gyms with 24/7 access right in the hotel. Sauna, ice plunge, pool — included."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 6.5h11M6.5 17.5h11M3 9.5v5M21 9.5v5M5.5 6.5v11M18.5 6.5v11" />
              </svg>
            }
          />
          <FeatureCard
            tone="primary"
            kicker="Workspace"
            title="24/7 coworking + cafe"
            description="Large coworking cafe with great food, dedicated phone booths for calls, and a beautiful private beach steps away. Just 45 minutes from Singapore."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            }
          />
          <FeatureCard
            tone="tertiary"
            kicker="Community"
            title="Daily events & meetups"
            description="Daily core team programming plus community-organized events: workshops, founder meetups, breathwork, beach runs. There's always something happening."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <FeatureCard
            tone="secondary"
            kicker="Conferences"
            title="Hackathons & summits"
            description="Regular conferences, hackathons, and workshops hosted by leading tech startups, top creators, and crypto teams. Build, ship, and meet the people doing the same."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            }
          />
        </div>
      </section>

      {/* DAILY SCHEDULE */}
      <section className="px-6 max-w-7xl mx-auto py-20">
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container-high rounded-3xl p-8 sm:p-12 border border-outline-variant/20 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/15 blur-[100px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-tertiary/15 blur-[100px] rounded-full" />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-3">
              A day at NS
            </p>
            <h3 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter mb-10">
              Wake up. <span className="text-primary">Train.</span>{" "}
              <span className="text-secondary">Build.</span>{" "}
              <span className="text-tertiary">Connect.</span>
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <ScheduleItem time="7:00 AM" title="Group Workout" desc="High-energy training to start the day strong." />
              <ScheduleItem time="8:30 AM" title="5-star Breakfast" desc="Hotel buffet — fuel up and meet the community." />
              <ScheduleItem time="11:00 AM" title="Group Workout" desc="Mid-morning movement option for the second wave." />
              <ScheduleItem time="1:00 PM" title="Longevity Lunch" desc="Curated by Bryan Johnson — eat for performance." />
              <ScheduleItem time="5:00 PM" title="Group Workout" desc="Sauna and ice plunge after to lock in recovery." />
              <ScheduleItem time="7:00 PM" title="Dinner & Events" desc="Workshops, talks, hackathons, beach hangs." />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 max-w-7xl mx-auto py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-3">
            Inside the campus
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] font-black font-headline tracking-tighter">
            Built for high performers.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {galleryImages.map((img, i) => (
            <PhotoTile
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={i % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}
              delay={i * 0.05}
            />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 max-w-7xl mx-auto py-24">
        <div className="relative bg-gradient-to-br from-primary via-secondary to-tertiary rounded-3xl p-1 animate-gradient">
          <div className="bg-surface rounded-[1.4rem] px-8 sm:px-16 py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(184,159,255,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,151,184,0.15),transparent_50%)]" />
            <div className="relative space-y-6">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary">
                Use my invite
              </p>
              <h2 className="text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-black font-headline tracking-tighter">
                Try NS for{" "}
                <span className="shimmer-text">a week, free.</span>
              </h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Living. Meals. Gyms. Workouts. Community. All in. Decide if it&apos;s
                for you — no commitment.
              </p>
              <div className="pt-4">
                <a
                  href={INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-12 py-6 rounded-full text-xl font-black animate-pulse-glow"
                >
                  Get My Free Week
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-on-surface-variant pt-2">
                ns.com/invite/<span className="text-primary font-bold">konradgnat</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-black font-headline text-on-surface">{value}</div>
      <div className="text-xs uppercase tracking-widest text-on-surface-variant">{label}</div>
    </div>
  );
}

function FeatureCard({
  kicker,
  title,
  description,
  icon,
  tone,
}: {
  kicker: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneMap = {
    primary: {
      pill: "bg-primary/20 text-primary",
      iconBg: "bg-primary/15 text-primary",
      hoverBorder: "hover:border-primary/50",
    },
    secondary: {
      pill: "bg-secondary/20 text-secondary",
      iconBg: "bg-secondary/15 text-secondary",
      hoverBorder: "hover:border-secondary/50",
    },
    tertiary: {
      pill: "bg-tertiary/20 text-tertiary",
      iconBg: "bg-tertiary/15 text-tertiary",
      hoverBorder: "hover:border-tertiary/50",
    },
  }[tone];

  return (
    <div
      className={`group relative bg-surface-container-low/60 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:bg-surface-container-high ${toneMap.hoverBorder}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${toneMap.iconBg} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${toneMap.pill}`}>
        {kicker}
      </span>
      <h3 className="text-2xl font-black mt-4 leading-tight font-headline text-on-surface">
        {title}
      </h3>
      <p className="text-on-surface-variant mt-3 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ScheduleItem({ time, title, desc }: { time: string; title: string; desc: string }) {
  return (
    <div className="bg-surface/60 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-6 hover:border-primary/40 transition-colors">
      <p className="text-tertiary font-mono text-sm font-bold mb-2">{time}</p>
      <h4 className="text-xl font-black font-headline text-on-surface">{title}</h4>
      <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">{desc}</p>
    </div>
  );
}

function PhotoTile({
  src,
  alt,
  className,
  delay,
}: {
  src: string;
  alt: string;
  className?: string;
  delay: number;
}) {
  return (
    <div
      className={`relative group rounded-2xl overflow-hidden border border-outline-variant/20 animate-fade-up bg-gradient-to-br from-primary/30 via-secondary/20 to-tertiary/30 ${className ?? ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs font-bold tracking-widest uppercase text-on-surface drop-shadow-lg">
          {alt}
        </p>
      </div>
    </div>
  );
}
