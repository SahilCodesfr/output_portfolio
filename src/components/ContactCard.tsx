import { useState, useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import confetti from "canvas-confetti";

/**
 * ContactCard — explicit white text on black background.
 * No CSS variable dependency so text is always visible.
 */
const EMAIL = "wwesahilsonkar@gmail.com";

const ApertureIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <circle cx="24" cy="24" r="13" />
    <circle cx="24" cy="24" r="3" fill="currentColor" />
  </svg>
);

const HexIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" />
    <circle cx="24" cy="24" r="3.5" fill="currentColor" />
  </svg>
);

export const ContactCard = () => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const emailBtnRef = useRef<HTMLButtonElement>(null);

  const fireConfetti = () => {
    const el = emailBtnRef.current;
    let origin = { x: 0.5, y: 0.6 };
    if (el) {
      const r = el.getBoundingClientRect();
      origin = {
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height / 2) / window.innerHeight,
      };
    }
    const defaults = {
      origin,
      colors: ["#f59e0b", "#ef6c1a", "#22c55e", "#ffffff"],
      disableForReducedMotion: true,
    };
    confetti({ ...defaults, particleCount: 70, spread: 70, startVelocity: 35, scalar: 0.9 });
    confetti({ ...defaults, particleCount: 30, spread: 120, startVelocity: 25, scalar: 0.7, ticks: 200 });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 40, angle: 60, spread: 55, startVelocity: 45 });
      confetti({ ...defaults, particleCount: 40, angle: 120, spread: 55, startVelocity: 45 });
    }, 150);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* ignore */
    }
    setCopied(true);
    fireConfetti();
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 2200);
  };

  return (
    <article
      className="relative w-full min-h-[420px] rounded-[24px] p-6 overflow-hidden flex flex-col md:pb-[68px]"
      style={{ backgroundColor: "black", boxShadow: "var(--shadow-card)" }}
    >
      {/* Top row */}
      <header className="flex items-center gap-3 mb-6 animate-fade-up">
        <div className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/90">
          <ApertureIcon className="h-5 w-5 animate-icon-spin-slow" />
        </div>
        <div className="flex items-center gap-2 px-4 h-9 rounded-full border border-white/10">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-[hsl(var(--success))] animate-pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
          </span>
          <span className="text-[12px] tracking-[0.02em] text-white/80">Available for work</span>
        </div>
      </header>

      {/* Heading */}
      <h1
        className="font-display text-[32px] leading-[1.05] tracking-[-0.02em] font-semibold text-white animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        LET'S BUILD<br />SOMETHING
      </h1>
      <p
        className="font-serif-italic text-[22px] leading-[1.05] mt-3 text-white/50 tracking-[-0.01em] animate-fade-up"
        style={{ animationDelay: "160ms" }}
      >
        that actually works.
      </p>

      <div className="mt-5 h-px bg-white/10" />

      {/* Email row */}
      <button
        type="button"
        ref={emailBtnRef}
        onClick={handleCopy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative w-full mt-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
        aria-label="Copy email to clipboard"
      >
        <div className="flex items-center gap-3">
          <HexIcon className="h-5 w-5 text-white/50 shrink-0" />
          <span className="text-[14px] leading-[1.6] text-white/90 tracking-tight truncate">{EMAIL}</span>
        </div>

        {/* Amber underline */}
        <div className="relative ml-[32px] mt-2 h-[2px] overflow-visible">
          <div
            className={`h-full rounded-full origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hovered || copied ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
            style={{ backgroundImage: "var(--gradient-underline)" }}
          />
        </div>

        {/* Status text */}
        <div className="ml-[32px] mt-2 h-4 font-mono-wide text-[10px] tracking-[0.1em]">
          {copied ? (
            <span className="flex items-center gap-2 text-[hsl(var(--success))] animate-fade-up">
              <Check className="h-3 w-3" strokeWidth={2.5} />
              COPIED TO CLIPBOARD
            </span>
          ) : (
            <span className="text-white/40">TAP TO COPY EMAIL</span>
          )}
        </div>
      </button>

      {/* Connect button — mt-auto on mobile, absolute pinned to bottom on md+ */}
      <a
        href={`mailto:${EMAIL}`}
        className="mt-auto md:absolute md:bottom-6 md:left-6 md:right-6 flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-white text-black font-semibold tracking-[0.18em] text-[11px] hover:translate-y-[-1px] active:translate-y-0 transition-transform duration-200"
        style={{ boxShadow: "0 4px 20px rgba(255,255,255,0.12)" }}
      >
        CONNECT NOW
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
      </a>
    </article>
  );
};

export default ContactCard;
