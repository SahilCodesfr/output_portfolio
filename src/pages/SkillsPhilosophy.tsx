import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer,
  SiSanity, SiContentful, SiNodedotjs, SiExpress, SiPostgresql,
  SiMongodb, SiPrisma, SiZod, SiPnpm, SiBun, SiGit, SiGithub,
  SiVercel, SiDocker, SiExpo, SiClerk, SiLinux,
} from "react-icons/si";
import { FaBoxOpen, FaAws } from "react-icons/fa6";
import flowerImg from "@/assets/steel-flower.webp";

type Skill = {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  color?: string;
};

const rows: Skill[][] = [
  [
    { name: "ReactJS", Icon: SiReact, color: "#61DAFB" },
    { name: "NextJS", Icon: SiNextdotjs, color: "#aaaaaa" },
    { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#aaaaaa" },
    { name: "Motion", Icon: SiFramer, color: "#EAB308" },
  ],
  [
    { name: "AWS", Icon: FaAws, color: "#FF9900" },
    { name: "Docker", Icon: SiDocker, color: "#aaaaaa" },
    { name: "Expo", Icon: SiExpo, color: "#aaaaaa" },
    { name: "Clerk", Icon: SiClerk, color: "#aaaaaa" },
  ],
  [
    { name: "Contentful", Icon: SiContentful, color: "#aaaaaa" },
    { name: "NodeJS", Icon: SiNodedotjs, color: "#5FA04E" },
    { name: "ExpressJS", Icon: SiExpress, color: "#aaaaaa" },
    { name: "Linux", Icon: SiLinux, color: "#aaaaaa" },
  ],
  [
    { name: "Sanity", Icon: SiSanity, color: "#F03E2F" },
    { name: "TypeScript", Icon: SiTypescript, color: "#aaaaaa" },
    { name: "PostgreSQL", Icon: SiPostgresql, color: "#aaaaaa" },
    { name: "Prisma", Icon: SiPrisma, color: "#aaaaaa" },
  ],
  [
    { name: "Zustand", Icon: FaBoxOpen, color: "#C58E5A" },
    { name: "Zod", Icon: SiZod, color: "#aaaaaa" },
    { name: "pnpm", Icon: SiPnpm, color: "#F69220" },
    { name: "Bun", Icon: SiBun, color: "#ddddcc" },
  ],
  [
    { name: "Git", Icon: SiGit, color: "#F05032" },
    { name: "GitHub", Icon: SiGithub, color: "#aaaaaa" },
    { name: "Vercel", Icon: SiVercel, color: "#aaaaaa" },
    { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  ],
];

/* ── Ticker ─────────────────────────────────────────────── */
const WORDS = [
  "USER-FRIENDLY", "ADAPTIVE", "PROTECTED", "DEPENDABLE",
  "IMMERSIVE", "CAPTIVATING", "FLUID", "FUTURE-PROOF", "SEO-READY",
];
const REPS = 6;
const DURATION = 85;

const StarIcon = ({ dim = false }: { dim?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 28"
    fill="none"
    style={{ width: "clamp(12px,1.1vw,18px)", height: "clamp(12px,1.1vw,18px)", flexShrink: 0, opacity: dim ? 0.3 : 1 }}
  >
    <path d="M14 0L17.5 10.5L28 14L17.5 17.5L14 28L10.5 17.5L0 14L10.5 10.5L14 0Z" fill="white" />
  </svg>
);

const TickerItem = ({ word, dim = false }: { word: string; dim?: boolean }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 18, paddingRight: 18 }}>
    <StarIcon dim={dim} />
    <span style={{
      fontSize: "clamp(14px,1.8vw,26px)",
      fontWeight: 700,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      color: dim ? "rgba(255,255,255,0.35)" : "#fff",
      userSelect: "none",
      fontFamily: "'Oswald', sans-serif",
    }}>
      {word}
    </span>
  </span>
);

interface RibbonProps {
  direction: "left" | "right";
  background: string;
  boxShadow?: string;
  zIndex: number;
  dim?: boolean;
  topOffset: string;
}

const Ribbon = ({ direction, background, boxShadow, zIndex, dim, topOffset }: RibbonProps) => {
  const items = Array.from({ length: REPS }, (_, r) =>
    WORDS.map((w) => ({ key: `${r}-${w}`, word: w }))
  ).flat();
  const doubled = [...items, ...items];
  const rotation = direction === "left" ? "-4deg" : "4deg";
  const animName = direction === "left" ? "tickerLeft" : "tickerRight";

  return (
    <div
      style={{
        position: "absolute",
        left: "-20%",
        width: "140%",
        padding: "14px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        top: topOffset,
        background,
        transform: `rotate(${rotation})`,
        zIndex,
        boxShadow: boxShadow ?? "none",
      }}
      onMouseEnter={(e) => {
        const track = e.currentTarget.querySelector<HTMLElement>(".ticker-track");
        if (track) track.style.animationPlayState = "paused";
      }}
      onMouseLeave={(e) => {
        const track = e.currentTarget.querySelector<HTMLElement>(".ticker-track");
        if (track) track.style.animationPlayState = "running";
      }}
    >
      <div
        className="ticker-track"
        style={{
          display: "inline-flex",
          alignItems: "center",
          willChange: "transform",
          animation: `${animName} ${DURATION}s linear infinite`,
        }}
      >
        {doubled.map(({ key, word }) => (
          <TickerItem key={key} word={word} dim={dim} />
        ))}
      </div>
    </div>
  );
};

const RibbonTicker = () => (
  <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&display=swap');
      @keyframes tickerLeft  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
      @keyframes tickerRight { from { transform: translateX(-50%); } to { transform: translateX(0); }    }
    `}</style>
    <Ribbon direction="right" background="#7a0000" zIndex={1} dim topOffset="28%" />
    <Ribbon direction="left"  background="#cc1111" zIndex={2} topOffset="28%"
      boxShadow="0 4px 30px rgba(0,0,0,0.6), 0 -4px 20px rgba(0,0,0,0.4)" />
  </div>
);
/* ── end Ticker ─────────────────────────────────────────── */

const SkillsPhilosophy = () => {
  const [rotation, setRotation] = useState(0);
  const lastScrollY = useRef(0);
  const targetRotation = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      targetRotation.current -= delta * 0.6;
      lastScrollY.current = currentY;
    };
    const animate = () => {
      setRotation((prev) => {
        const next = prev + (targetRotation.current - prev) * 0.12;
        return Math.abs(next - targetRotation.current) < 0.01 ? targetRotation.current : next;
      });
      rafId.current = requestAnimationFrame(animate);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section className="min-h-screen bg-black text-white font-sans flex flex-col justify-center">

      {/* Quote */}
      <div className="w-full px-6 md:px-12 lg:px-16 pt-24 pb-12 md:pt-12 md:pb-12 z-10 md:flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-y-8"
        >
          <div className="md:col-span-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Skills & Philosophy</h2>
          </div>
          <div className="md:col-span-4">
            <blockquote className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-tight text-white">
              "The function of good software is to make the complex appear to be simple."
            </blockquote>
            <p className="mt-6 text-white/60">— Grady Booch</p>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-white/20" />

      {/* Flower + Skills */}
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <div className="relative flex w-full flex-col items-center">
          {/* Flower */}
          <div className="relative flex items-center justify-center">
            <div
              className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, hsl(320 100% 60% / 0.15), transparent 70%)" }}
            />
            <img
              src={flowerImg}
              alt="Steel flower representing my skillset"
              className="h-[220px] w-[220px] select-none object-contain sm:h-[320px] sm:w-[320px] md:h-[400px] md:w-[400px]"
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "50% 50%", willChange: "transform" }}
              draggable={false}
            />
          </div>

          {/* Headings overlay */}
          <div className="relative z-10 -mt-[90px] flex w-full flex-col items-center sm:-mt-[130px] md:-mt-[170px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-10 bottom-[-200px] -z-10 backdrop-blur-md"
              style={{
                background: "linear-gradient(to bottom, hsl(0 0% 0% / 0) 0%, hsl(0 0% 0% / 0.55) 45%, hsl(0 0% 0% / 0.9) 80%, hsl(0 0% 0% / 1) 100%)",
                maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 100%)",
              }}
            />
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/60">My Skillset</p>
            <h3 className="mt-2 text-center leading-tight tracking-tight">
              <span className="text-white text-3xl lg:text-4xl font-bold">The Magic </span>
              <span
                className="text-3xl lg:text-4xl font-bold italic skillset-magic-gradient"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Behind
              </span>
            </h3>
          </div>
        </div>

        {/* Skill pills */}
        <div className="relative z-10 mt-4 flex w-full max-w-4xl flex-col items-center gap-2 sm:gap-3">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
              {row.map(({ name, Icon, color }) => (
                <span key={name} className="skillset-pill">
                  <Icon className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" {...(color ? { style: { color } } : {})} />
                  <span>{name}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Ribbon Ticker — below the flower/pills section */}
      <RibbonTicker />


    </section>
  );
};

export default SkillsPhilosophy;
