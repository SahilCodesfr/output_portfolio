"use client";

import { useLayoutEffect, useRef, useState } from "react";
import RubiksCard from "@/components/RubiksCard";
import DetailDrivenCard from "@/components/DetailDrivenCard";
import ContactCard from "@/components/ContactCard";
import GlobalNavigator from "@/components/GlobalNavigator";
import ProServicesCard from "@/components/ProServicesCard";
import AnalogClock from "@/components/AnalogClock";

const CLOCK_SIZE = 270;
const CUTOUT_PADDING = 14;

const BentoSection = () => {
  const cutR = CLOCK_SIZE / 2 + CUTOUT_PADDING;

  const wrapRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const [clockPos, setClockPos] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    const update = () => {
      if (!wrapRef.current || !detailRef.current) return;
      if (window.innerWidth < 768) return;
      const wrap = wrapRef.current.getBoundingClientRect();
      const rect = detailRef.current.getBoundingClientRect();
      setClockPos({
        top: rect.bottom - wrap.top,
        left: rect.left - wrap.left + rect.width / 2,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (detailRef.current) ro.observe(detailRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const carve = (x: string, y: string): React.CSSProperties => ({
    WebkitMaskImage: `radial-gradient(circle ${cutR}px at ${x} ${y}, transparent 99%, #000 100%)`,
    maskImage: `radial-gradient(circle ${cutR}px at ${x} ${y}, transparent 99%, #000 100%)`,
  });

  /* ── MOBILE LAYOUT ──────────────────────────────────────── */
  if (isMobile) {
    return (
      <section className="w-full bg-black text-white py-6">
        <div className="flex flex-col gap-4 px-4">

          <div className="rounded-[24px] bg-black border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.08)] h-[400px] flex items-center justify-center">
            <RubiksCard />
          </div>

          <div className="rounded-[24px] bg-[#000000] border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.08)] overflow-hidden">
            <div className="[&_.root]:!min-h-0 [&_.root]:!p-0 [&_.root]:!bg-transparent [&_.card]:!bg-transparent [&_.card]:!max-w-none [&_.card]:!p-6">
              <DetailDrivenCard />
            </div>
          </div>

          <div className="rounded-[24px] bg-black border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col">
            <ContactCard />
          </div>

          <div className="rounded-[24px] bg-black border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.08)] overflow-hidden">
            <div className="[&_article]:h-[420px]">
              <GlobalNavigator />
            </div>
          </div>

          <div className="rounded-[24px] bg-[#0a0a0a] overflow-hidden">
            <ProServicesCard />
          </div>

        </div>
      </section>
    );
  }

  /* ── TABLET / DESKTOP LAYOUT ────────────────────────────── */
  return (
    <section className="w-full bg-black text-white overflow-hidden">
      <div ref={wrapRef} className="relative mx-auto max-w-[1600px] px-4 md:px-6 xl:px-10 py-4 md:py-6">

        {/* TOP ROW */}
        <div
          className="grid gap-4 md:gap-5 lg:gap-6 items-stretch"
          style={{ gridTemplateColumns: "repeat(12, minmax(0,1fr))" }}
        >
          {/* Rubiks */}
          <div className="col-span-4 lg:col-span-3 p-1">
            <div className="rounded-[24px] bg-black h-full min-h-[360px] md:min-h-[400px] lg:min-h-[440px] xl:min-h-[500px] border border-white/10
              shadow-[0_0_25px_rgba(255,255,255,0.08)] flex items-center justify-center
              hover:shadow-[0_0_60px_rgba(255,255,255,0.12)] transition-all duration-300">
              <RubiksCard />
            </div>
          </div>

          {/* Detail Driven */}
          <div className="col-span-4 lg:col-span-6 p-2">
            <div
              ref={detailRef}
              className="rounded-[24px] bg-[#000000] h-full min-h-[360px] md:min-h-[400px] lg:min-h-[445px] xl:min-h-[510px] border border-white/10
                shadow-[0_0_25px_rgba(255,255,255,0.08)] overflow-hidden
                hover:shadow-[0_0_60px_rgba(255,255,255,0.12)] transition-all duration-300"
              style={carve("50%", "100%")}
            >
              <div className="[&_.root]:!min-h-0 [&_.root]:!p-0 [&_.root]:!bg-transparent [&_.card]:!bg-transparent [&_.card]:!max-w-none [&_.card]:!p-6 [&_.card]:!pb-[170px]">
                <DetailDrivenCard />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-4 lg:col-span-3 p-1">
            <div className="rounded-[24px] bg-black h-full min-h-[360px] md:min-h-[400px] lg:min-h-[440px] xl:min-h-[500px] border border-white/10
              shadow-[0_0_25px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col
              hover:shadow-[0_0_60px_rgba(255,255,255,0.12)] transition-all duration-300">
              <ContactCard />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div
          className="grid gap-4 md:gap-5 lg:gap-6 mt-4 md:mt-5 lg:mt-6"
          style={{ gridTemplateColumns: "repeat(12, minmax(0,1fr))" }}
        >
          {/* Global Navigator */}
          <div className="col-span-6 translate-y-[-20px] md:translate-y-[-25px] lg:translate-y-[-30px] p-2">
            <div
              className="rounded-[24px] bg-black border border-white/10
                shadow-[0_0_25px_rgba(255,255,255,0.08)] overflow-hidden
                hover:shadow-[0_0_60px_rgba(255,255,255,0.12)] transition-all duration-300"
              style={carve("100%", "0%")}
            >
              <div className="[&_article]:h-[430px] md:[&_article]:h-[460px] lg:[&_article]:h-[494px] xl:[&_article]:h-[560px]">
                <GlobalNavigator />
              </div>
            </div>
          </div>

          {/* Pro Services */}
          <div className="col-span-6 translate-y-[-20px] md:translate-y-[-25px] lg:translate-y-[-30px] p-2">
            <div
              className="rounded-[24px] bg-[#0a0a0a] h-[440px] md:h-[470px] lg:h-[500px] xl:h-[570px] overflow-hidden
                hover:shadow-[0_0_60px_rgba(255,255,255,0.12)] transition-all duration-300"
              style={carve("0%", "0%")}
            >
              <ProServicesCard />
            </div>
          </div>
        </div>

        {/* CLOCK */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            top: clockPos.top,
            left: clockPos.left,
            transform: "translate(-50%, -50%)",
            width: CLOCK_SIZE,
            height: CLOCK_SIZE,
          }}
        >
          <div className="pointer-events-auto w-full h-full flex items-center justify-center rounded-full">
            <AnalogClock size={CLOCK_SIZE} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default BentoSection;
