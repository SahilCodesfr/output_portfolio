import { MapPin, Globe, BadgeCheck } from "lucide-react";
import SplashCursor from "@/components/SplashCursor";
import { motion } from "framer-motion";

const SpinningCTA = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="absolute md:z-30 lg:z-10 hidden md:flex items-center justify-center"
    style={{ bottom: "3.6rem", right: "2rem" }}
  >
    <style>{`
      @keyframes ctaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .cta-ring { animation: ctaSpin var(--cta-spin-duration, 10s) linear infinite; transform-origin: center; }
      .cta-wrap:hover .cta-ring { --cta-spin-duration: 3s; }
      .cta-wrap { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .cta-wrap:hover { transform: scale(1.08); }
    `}</style>
    <a href="#contact" className="cta-wrap group relative flex items-center justify-center w-[130px] h-[130px]" aria-label="Get in touch">
      <svg viewBox="0 0 130 130" className="absolute inset-0 w-full h-full pointer-events-none">
        <circle cx="65" cy="65" r="40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      </svg>
      <svg viewBox="0 0 130 130" className="cta-ring absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <path id="cta-circle-path" d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text fill="rgba(255,255,255,1)" fontSize="8.5" fontFamily="'Inter', sans-serif" fontWeight="900" letterSpacing="4">
          <textPath href="#cta-circle-path">GET IN TOUCH · GET IN TOUCH · GET IN TOUCH ·&nbsp;</textPath>
        </text>
      </svg>
      <span className="absolute inset-4 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" style={{ transformOrigin: "center" }} />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10 w-6 h-6 text-white group-hover:text-black" style={{ transition: "color 0.3s ease" }}>
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  </motion.div>
);

const SocialStrip = () => {
  const socials = [
    { label: "GitHub", href: "https://github.com/SahilCodesfr" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "Instagram", href: "https://www.instagram.com/demn.sahil" },
    { label: "Email", href: "mailto:wwesahilsonkar@gmail.com" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute z-20 hidden md:flex flex-col items-center"
      style={{ right: "64px", top: "112px", bottom: "194px", justifyContent: "center", gap: "1rem" }}
    >
      <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
      {socials.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          title={label}
          className="group flex-shrink-0"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <span className="font-sans font-black text-[10px] tracking-[0.22em] uppercase text-white group-hover:opacity-100 transition-opacity duration-300">
            {label}
          </span>
        </a>
      ))}
      <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Splash cursor effect — hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <SplashCursor />
      </div>
      <SocialStrip />
      <div className="relative z-10 flex min-h-screen flex-col px-6 sm:px-8 md:px-12 pt-6 md:pt-7 pb-8">
        <div className="flex flex-col mt-24 md:mt-28">
          <p className="font-cinzel font-bold text-[13px] md:text-[15px] tracking-[0.08em] text-white mb-3 md:mb-4">
            HI! I AM,
          </p>
          <h1 className="font-cinzel-decorative font-bold text-white leading-[0.82] uppercase text-[26vw] md:text-[24vw] lg:text-[22vw] tracking-[-0.03em]">
            SAHIL
          </h1>

          <div className="mt-10 md:mt-14 flex flex-col md:flex-row gap-8 md:gap-10 items-start">
            <div className="flex gap-5 md:flex-[7]">
              <div className="w-[2px] bg-hero-accent shrink-0 self-stretch" />
              <h2 className="font-cinzel font-bold text-2xl sm:text-3xl md:text-[2.1rem] uppercase tracking-[0.01em] leading-[1.1] text-white">
                I design the products
                <br />
                that delivers
                <br />
                <span className="text-hero-accent">real impact</span>
              </h2>
            </div>

            <div className="md:flex-[5] md:pl-2 md:pt-2">
              <div className="h-[2px] w-9 bg-hero-accent mb-4" />
              <p className="text-hero-muted text-[15px] md:text-base max-w-[20rem] leading-[1.65]">
                Crafting digital experiences that make a difference.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 md:mt-16 lg:mt-auto flex flex-col md:flex-row md:items-center md:justify-between divide-y divide-white/10 md:divide-y-0">
          <InfoItem
            icon={<MapPin className="h-7 w-7 text-hero-accent" strokeWidth={1.5} />}
            title="BASED IN KOLKATA"
            line="INDIA"
          />
          <InfoItem
            icon={<Globe className="h-7 w-7 text-hero-accent" strokeWidth={1.5} />}
            title="AVAILABLE"
            line="ALL AROUND WORLDWIDE"
            divider
          />
          <InfoItem
            icon={<BadgeCheck className="h-7 w-7 text-hero-accent" strokeWidth={1.5} />}
            title="CREATIVE DEVELOPER"
            line="+ UI/UX DESIGNER"
            divider
          />
          <SpinningCTA />
        </div>
      </div>
    </section>
  );
};

const InfoItem = ({
  icon,
  title,
  line,
  divider,
}: {
  icon: React.ReactNode;
  title: string;
  line: string;
  divider?: boolean;
}) => (
  <div
    className={`flex items-center gap-4 py-5 md:py-0 flex-1 ${
      divider ? "md:border-l md:border-white/15 md:pl-8 md:py-0" : ""
    }`}
  >
    {icon}
    <div className="min-w-0">
      <p className="text-[12px] md:text-[13px] font-bold tracking-[0.12em] text-white mb-[6px] leading-none">
        {title}
      </p>
      <p className="text-[12px] md:text-[13px] tracking-[0.12em] text-hero-muted leading-[1.5]">
        {line}
      </p>
    </div>
  </div>
);

export default Hero;
