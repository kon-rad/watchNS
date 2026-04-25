import type { Metadata } from "next";
import Link from "next/link";
import JoinNSGallery from "@/components/JoinNSGallery";

const INVITE_URL = "https://ns.com/invite/konradgnat";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&bgcolor=ffffff&color=37008e&data=${encodeURIComponent(INVITE_URL)}`;
const TOTAL_GALLERY_PHOTOS = 88;

export const metadata: Metadata = {
  title: "Join Network School — A Startup Society | WatchNS",
  description:
    "The Network School is a frontier community for techno-optimists. Live with builders, learn from the best, train daily, and ship faster. Apply with my invite for a free week.",
};

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
                The Network School · A Startup Society
              </span>
            </div>

            <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[0.88] font-black font-headline tracking-tighter">
              <span className="text-on-surface">Live, learn,</span>
              <br />
              <span className="shimmer-text">burn, earn,</span>
              <br />
              <span className="text-on-surface">have fun.</span>
            </h1>

            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
              The Network School is a frontier community for techno-optimists.
              Build yourself up while building a startup society alongside
              remote workers, founders, creators, and engineers from around
              the world.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold animate-pulse-glow"
              >
                Apply with my invite
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a
                href="#why-ns"
                className="inline-flex items-center gap-2 px-8 py-5 rounded-full border border-outline-variant/40 text-on-surface font-bold hover:bg-surface-container-high transition-colors"
              >
                Why come to NS
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-on-surface-variant">
              <Stat label="From" value="$1,500/mo" />
              <div className="w-px h-10 bg-outline-variant/30" />
              <Stat label="All-inclusive" value="Society" />
              <div className="w-px h-10 bg-outline-variant/30" />
              <Stat label="Near" value="Singapore" />
            </div>
          </div>

          {/* QR + invite card */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-3xl rotate-3 animate-gradient" />
              <div className="absolute inset-0 bg-surface rounded-3xl -rotate-1" />
              <div className="relative bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl p-8 h-full flex flex-col items-center justify-center gap-4 editorial-shadow border border-outline-variant/20">
                <p className="text-xs font-bold tracking-[0.25em] uppercase text-tertiary">
                  Scan to apply
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="bg-white p-4 rounded-2xl shadow-2xl animate-float">
                  <img
                    src={QR_URL}
                    alt="QR code to apply to Network School"
                    width="240"
                    height="240"
                    className="w-60 h-60"
                  />
                </div>
                <p className="text-on-surface font-bold text-center">
                  ns.com/invite/<span className="text-primary">konradgnat</span>
                </p>
                <p className="text-xs text-on-surface-variant">
                  1 week free with this invite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 max-w-5xl mx-auto py-16">
        <div className="text-center space-y-6">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary">
            What is the Network School?
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-black font-headline tracking-tighter">
            A frontier community for{" "}
            <span className="shimmer-text">techno-optimists.</span>
          </h2>
          <p className="text-lg sm:text-xl text-on-surface-variant leading-relaxed max-w-3xl mx-auto">
            Our members include remote workers, digital nomads, online creators,
            personal trainers, self-improvers, event organizers, and engineers
            of all stripes. You should apply if you want to build yourself up
            while also building a startup society that bootstraps other startup
            societies.
          </p>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl mx-auto">
            Membership starts at <span className="text-on-surface font-bold">$1,500/month with roommates</span>
            {" "}and includes everything from meals to gym to accommodations. We
            think of it as society-as-a-service.
          </p>
        </div>
      </section>

      {/* WHY NS — Learn / Burn / Earn / Fun */}
      <section id="why-ns" className="px-6 max-w-7xl mx-auto py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-4">
            Why come to Network School
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-black font-headline tracking-tighter">
            Live with builders. <span className="shimmer-text">Learn, burn, earn,</span> and have fun.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PillarCard
            tone="primary"
            kicker="Learn"
            title="Talks from founders and investors"
            description="Past speakers include Vitalik Buterin (Ethereum), Bryan Johnson (Don't Die), Ryan Petersen (Flexport), Shailesh Lakhani (Sequoia India / Peak), and Olaf Carlson-Wee (Polychain)."
          />
          <PillarCard
            tone="tertiary"
            kicker="Burn"
            title="Daily workouts and healthy meals"
            description="Our trainers maximize your fitness, while our chefs optimize your food. All you have to do is stay with us to stay in shape."
          />
          <PillarCard
            tone="secondary"
            kicker="Earn"
            title="Work remotely, but in a community"
            description="Meet collaborators when you're heads up, and save money when you're heads down."
          />
          <PillarCard
            tone="primary"
            kicker="Fun"
            title="A flexible social calendar"
            description="New events pop up every few days. Hang out with fellow techno-optimists from around the world, and visit Singapore next door."
          />
        </div>
      </section>

      {/* MEMBERSHIP INCLUDES */}
      <section className="px-6 max-w-7xl mx-auto py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-4">
            Starting at $1,500/month
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-black font-headline tracking-tighter">
            Your membership includes <span className="shimmer-text">everything.</span>
          </h2>
          <p className="mt-6 text-lg text-on-surface-variant">
            From room to food to gym. Society-as-a-service.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Nutritious Meals", icon: "meals" },
            { label: "24/7 Gym Access", icon: "gym" },
            { label: "World-Class Lectures", icon: "lecture" },
            { label: "Community Events", icon: "events" },
            { label: "24/7 Coworking", icon: "work" },
            { label: "Content Studio", icon: "studio" },
            { label: "Workshops", icon: "workshop" },
            { label: "Fitness Classes", icon: "fitness" },
            { label: "Makerspace", icon: "maker" },
            { label: "High-Speed Wi-Fi", icon: "wifi" },
          ].map((item) => (
            <IncludedTile key={item.label} label={item.label} iconKey={item.icon} />
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <RoomTier name="With Roommate" price="$1,500" />
          <RoomTier name="Private Room" price="$3,000" />
          <RoomTier name="Serviced Room" price="Inquire" />
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 max-w-7xl mx-auto py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-3">
            Gallery
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-black font-headline tracking-tighter">
            See what NS is <span className="shimmer-text">all about.</span>
          </h2>
          <p className="mt-4 text-on-surface-variant">
            {TOTAL_GALLERY_PHOTOS} moments from inside the campus. Click any image to expand.
          </p>
        </div>
        <JoinNSGallery count={TOTAL_GALLERY_PHOTOS} />
      </section>

      {/* SPEAKERS */}
      <section className="px-6 max-w-7xl mx-auto py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-3">
            NS Speakers
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-black font-headline tracking-tighter">
            Founders, investors,{" "}
            <span className="shimmer-text">operators.</span>
          </h2>
          <p className="mt-4 text-on-surface-variant">
            Past speakers at Network School, the Network State Podcast, and the
            annual Network State Conference.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SPEAKERS.map((s) => (
            <SpeakerChip key={s.name} name={s.name} role={s.role} />
          ))}
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
              <ScheduleItem time="8:30 AM" title="Breakfast" desc="Hotel buffet — fuel up and meet the community." />
              <ScheduleItem time="11:00 AM" title="Group Workout" desc="Mid-morning movement option for the second wave." />
              <ScheduleItem time="1:00 PM" title="Lunch" desc="Healthy meals optimized for performance." />
              <ScheduleItem time="5:00 PM" title="Group Workout" desc="Sauna and ice plunge after to lock in recovery." />
              <ScheduleItem time="7:00 PM" title="Dinner & Events" desc="Workshops, talks, hackathons, beach hangs." />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 max-w-4xl mx-auto py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-3">
            FAQs
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-black font-headline tracking-tighter">
            Common questions.
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
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
                You might be our next member
              </p>
              <h2 className="text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-black font-headline tracking-tighter">
                Apply to{" "}
                <span className="shimmer-text">Network School.</span>
              </h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Live with builders from around the world. Learn, burn, earn, and
                have fun. If you want to join us, please do apply.
              </p>
              <div className="pt-4">
                <a
                  href={INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-12 py-6 rounded-full text-xl font-black animate-pulse-glow"
                >
                  Apply Now — 1 Week Free
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-on-surface-variant pt-2">
                ns.com/invite/<span className="text-primary font-bold">konradgnat</span>
              </p>
              <Link
                href="/"
                className="inline-block text-sm text-on-surface-variant hover:text-primary underline-offset-4 hover:underline"
              >
                ← Back to WatchNS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const SPEAKERS: { name: string; role: string }[] = [
  { name: "Vitalik Buterin", role: "Cofounder, Ethereum" },
  { name: "Brian Armstrong", role: "Cofounder, Coinbase" },
  { name: "Richard Teng", role: "CEO, Binance" },
  { name: "Ben Horowitz", role: "Cofounder, a16z" },
  { name: "Bryan Johnson", role: "Founder, Don't Die" },
  { name: "Naval Ravikant", role: "Cofounder, AngelList" },
  { name: "Amjad Masad", role: "Cofounder, Replit" },
  { name: "Anatoly Yakovenko", role: "Cofounder, Solana" },
  { name: "Glenn Greenwald", role: "Founder, The Intercept" },
  { name: "Andrew Huberman", role: "Huberman Podcast" },
  { name: "Nuseir Yassin", role: "Cofounder, Nas Daily" },
  { name: "Ranveer Allahbadia", role: "The Ranveer Show" },
  { name: "Michael Saylor", role: "CEO, MicroStrategy" },
  { name: "Tobi Lutke", role: "CEO, Shopify" },
  { name: "Winklevoss Twins", role: "Cofounders, Gemini" },
  { name: "Joe Lonsdale", role: "Founder, Palantir" },
  { name: "Garry Tan", role: "CEO, YCombinator" },
  { name: "Avlok Kohli", role: "CEO, AngelList" },
  { name: "Jesse Powell", role: "Cofounder, Kraken" },
  { name: "Jason Calacanis", role: "Early Investor, Uber" },
  { name: "Arthur Hayes", role: "Cofounder, BitMEX" },
  { name: "Pieter Levels", role: "Cofounder, Nomad List" },
  { name: "Olaf Carlson-Wee", role: "Founder, Polychain" },
  { name: "Zooko Wilcox", role: "Cofounder, Zcash" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I apply to Network School?",
    a: "Please apply at ns.com/invite/konradgnat — using my invite link includes a free first week. You'll receive a confirmation email acknowledging your application.",
  },
  {
    q: "What's the program at Network School like?",
    a: "Live, learn, burn, earn, and have fun. Days mix talks from founders and investors, daily group workouts and healthy meals, 24/7 coworking, and a flexible social calendar with workshops, hackathons, and community events.",
  },
  {
    q: "How much does it cost to attend Network School?",
    a: "Membership starts at $1,500/month with a roommate. Private rooms are $3,000/month, and serviced rooms are available on request. Every tier is all-inclusive.",
  },
  {
    q: "What is included in the membership fee?",
    a: "Accommodation, three nutritious meals a day, 24/7 gym access, fitness classes, world-class lectures, workshops, community events, 24/7 coworking, content studio, makerspace, and high-speed Wi-Fi. Society-as-a-service.",
  },
  {
    q: "How long do people stay at Network School?",
    a: "Stays range from a single cohort (a few weeks) to many months. Plenty of members extend after their first cohort.",
  },
  {
    q: "When does each Network School cohort start?",
    a: "New cohorts start regularly throughout the year. Once you apply, the team will share the upcoming cohort calendar so you can pick the dates that work for you.",
  },
  {
    q: "What are the visa requirements?",
    a: "Network School is in Forest City, Malaysia, where most nationalities receive a visa on arrival. Once you're accepted, the team will help with the specifics for your passport and intended length of stay.",
  },
  {
    q: "Can I bring coworkers and friends with me?",
    a: "Yes — startup teams regularly come to Network School to live together and build faster. Each person on your team should submit their own application.",
  },
  {
    q: "Are you family friendly?",
    a: "Many members come solo, but families are welcome on a case-by-case basis. Mention your situation in your application and the team will follow up.",
  },
  {
    q: "Can we invite visitors for day trips?",
    a: "Yes, but they will need to check in if they're using the facilities. We can figure out logistics once you're on campus.",
  },
  {
    q: "Are there many different fitness activities?",
    a: "Three group workouts a day at 7 AM, 11 AM, and 5 PM, two fully-equipped 24/7 gyms, fitness classes, sauna, ice plunge, pool, and a beach right outside. There's something for every training style.",
  },
  {
    q: "Is food included in the membership?",
    a: "Yes. Three meals a day are included — a 5-star hotel breakfast buffet plus healthy lunch and dinner curated for performance and longevity.",
  },
  {
    q: "Is internet included in the membership?",
    a: "Yes. High-speed Wi-Fi throughout the campus, dedicated phone booths in the cafe for calls, and 24/7 coworking space.",
  },
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-black font-headline text-on-surface">{value}</div>
      <div className="text-xs uppercase tracking-widest text-on-surface-variant">{label}</div>
    </div>
  );
}

function PillarCard({
  kicker,
  title,
  description,
  tone,
}: {
  kicker: string;
  title: string;
  description: string;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneMap = {
    primary: { pill: "bg-primary/20 text-primary", border: "hover:border-primary/50" },
    secondary: { pill: "bg-secondary/20 text-secondary", border: "hover:border-secondary/50" },
    tertiary: { pill: "bg-tertiary/20 text-tertiary", border: "hover:border-tertiary/50" },
  }[tone];

  return (
    <div className={`group relative bg-surface-container-low/60 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:bg-surface-container-high ${toneMap.border}`}>
      <span className={`px-3 py-1 text-[10px] font-black tracking-[0.25em] uppercase rounded-full ${toneMap.pill}`}>
        {kicker}
      </span>
      <h3 className="text-2xl sm:text-3xl font-black mt-4 leading-tight font-headline text-on-surface">
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

function IncludedTile({ label, iconKey }: { label: string; iconKey: string }) {
  return (
    <div className="bg-surface-container-low/60 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
      <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
        <IncludedIcon iconKey={iconKey} />
      </div>
      <p className="text-sm font-bold text-on-surface leading-tight">{label}</p>
    </div>
  );
}

function IncludedIcon({ iconKey }: { iconKey: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (iconKey) {
    case "meals":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <path d="M3 2v7c0 1.1.9 2 2 2h2v11h2V11h2c1.1 0 2-.9 2-2V2" />
          <path d="M19 2v20" />
          <path d="M19 2c-1.7 0-3 1.3-3 3v7h6V5c0-1.7-1.3-3-3-3z" />
        </svg>
      );
    case "gym":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <path d="M6.5 6.5h11M6.5 17.5h11M3 9.5v5M21 9.5v5M5.5 6.5v11M18.5 6.5v11" />
        </svg>
      );
    case "lecture":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <path d="M2 10v3" />
          <path d="M22 10v3" />
          <path d="M6 6h12v12H6z" />
          <path d="M9 22V18M15 22V18" />
        </svg>
      );
    case "events":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "work":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "studio":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <polygon points="22 8 16 12 22 16 22 8" />
        </svg>
      );
    case "workshop":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "fitness":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4l3 4M9 11l-2 4M15 11l2 8" />
        </svg>
      );
    case "maker":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case "wifi":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...common}>
          <path d="M5 12.55a11 11 0 0 1 14 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      );
    default:
      return null;
  }
}

function RoomTier({ name, price }: { name: string; price: string }) {
  return (
    <div className="bg-surface-container-low/60 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors">
      <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">
        {name}
      </p>
      <p className="text-3xl font-black font-headline text-on-surface mt-2">
        {price}
      </p>
      <p className="text-xs text-on-surface-variant mt-1">per month, all-inclusive</p>
    </div>
  );
}

function SpeakerChip({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="group bg-surface-container-low/60 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-tertiary flex items-center justify-center text-on-primary-fixed font-black text-sm shrink-0">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-on-surface text-sm leading-tight truncate">{name}</p>
        <p className="text-xs text-on-surface-variant leading-tight truncate">{role}</p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-surface-container-low/60 backdrop-blur-sm border border-outline-variant/20 rounded-2xl open:border-primary/40 transition-colors">
      <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4 font-bold text-on-surface">
        <span>{q}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-tertiary transition-transform group-open:rotate-45 shrink-0"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </summary>
      <div className="px-6 pb-5 text-on-surface-variant leading-relaxed">{a}</div>
    </details>
  );
}
