import { useState } from "react";
import { MapPin } from "lucide-react";
import { GlobePulse, type PulseMarker } from "@/components/ui/cobe-globe-pulse";

interface Region {
  code: string;
  name: string;
  markerId: string;
  location: [number, number];
}

const regions: Region[] = [
  { code: "GB", name: "UK", markerId: "pulse-uk", location: [51.51, -0.13] },
  { code: "IN", name: "India", markerId: "pulse-in", location: [20.59, 78.96] },
  { code: "US", name: "USA", markerId: "pulse-us", location: [37.77, -122.42] },
];

const markers: PulseMarker[] = regions.map((r) => ({
  id: r.markerId,
  location: r.location,
}));

const Index = () => {
  const [activeCode, setActiveCode] = useState("IN");
  const active = regions.find((r) => r.code === activeCode) ?? regions[1];

  return (
    <main className="w-full bg-black">
      <article
        className="timezone-card relative w-full h-full rounded-[24px] overflow-hidden p-6"
        aria-label="Available globally — adaptable across time zones"
      >
        <header className="relative z-20">
          <p className="text-[12px] tracking-[0.1em] text-neutral-500 font-medium uppercase">
            Available Globally
          </p>
          <h1 className="mt-4 text-white text-[34px] leading-[1.05] tracking-[-0.02em] font-semibold max-w-[320px]">
            Adaptable across
            <br />
            time zones
          </h1>
        </header>

        <div
          className="absolute z-10 globe-glow"
          style={{
            width: "82%",
            aspectRatio: "1 / 1",
            left: "-12%",
            bottom: "-22%",
          }}
        >
          <GlobePulse
            className="w-full h-full"
            markers={markers}
            activeId={active.markerId}
          />
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {regions.map((r) => {
            const isActive = r.code === activeCode;
            return (
              <button
                key={r.code}
                type="button"
                onClick={() => setActiveCode(r.code)}
                aria-pressed={isActive}
                className={`${
                  isActive ? "pill-btn-active" : "pill-btn"
                } rounded-full px-4 py-2 text-[13px] font-medium flex items-center gap-3 min-w-[120px] border border-white/10 transition-colors hover:brightness-125 cursor-pointer`}
              >
                <span className="font-mono text-[12px] opacity-80">{r.code}</span>
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-6 right-6 z-20 text-right">
          <div className="flex items-center justify-end gap-2 text-neutral-500 text-[12px] tracking-[0.1em] font-medium uppercase">
            <MapPin className="w-3 h-3" strokeWidth={2} />
            <span>Remote · {active.name}</span>
          </div>
        </div>
      </article>
    </main>
  );
};

export default Index;
