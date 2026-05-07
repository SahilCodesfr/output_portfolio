"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import createGlobe from "cobe";

export interface PulseMarker {
  id: string;
  location: [number, number];
}

interface GlobePulseProps {
  markers?: PulseMarker[];
  activeId?: string;
  className?: string;
  speed?: number;
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-uk", location: [51.51, -0.13] },
  { id: "pulse-in", location: [20.59, 78.96] },
];

interface MarkerScreen {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

export function GlobePulse({
  markers = defaultMarkers,
  activeId,
  className = "",
  speed = 0.003,
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerInteracting = useRef<{ x: number } | null>(null);
  const dragOffset = useRef({ phi: 0 });
  const phiOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const markersRef = useRef(markers);
  const activeIdRef = useRef(activeId);
  const currentPhiRef = useRef(0);
  const [screenMarkers, setScreenMarkers] = useState<MarkerScreen[]>([]);

  useEffect(() => {
    markersRef.current = markers;
    activeIdRef.current = activeId;
  }, [markers, activeId]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      dragOffset.current = { phi: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;
    let lastUpdate = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      const globeOptions = {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 0.8,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.35, 0.35, 0.35],
        markerColor: [1, 1, 1],
        glowColor: [1, 1, 1],
        markerElevation: 0,
        // Empty — we render markers as DOM overlays so we can color them per-id
        markers: [],
        opacity: 0.95,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      globe = createGlobe(canvas, globeOptions as any);

      function animate() {
        if (!isPausedRef.current) phi += speed;
        const totalPhi = phi + phiOffsetRef.current + dragOffset.current.phi;
        currentPhiRef.current = totalPhi;
        globe!.update({ phi: totalPhi, theta: 0 });

        // Throttle DOM updates to ~30fps
        const now = performance.now();
        if (now - lastUpdate > 33) {
          lastUpdate = now;
          updateScreenMarkers(totalPhi);
        }
        animationId = requestAnimationFrame(animate);
      }

      function updateScreenMarkers(currentPhi: number) {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        // Match cobe's internal projection exactly.
        // cobe converts [lat, lon] -> 3D unit vector via:
        //   r = lat*π/180; a = lon*π/180 - π
        //   t = [-cos(r)*cos(a), sin(r), cos(r)*sin(a)]
        // Then with theta=0, phi=f:
        //   c = cos(phi)*t[0] + sin(phi)*t[2]   (NDC x, before aspect)
        //   s = t[1]                            (NDC y)
        //   z = -sin(phi)*t[0] + cos(phi)*t[2]  (depth, >=0 means front)
        // Final screen NDC: x = c / (W/H), y = -s, both scaled by 0.8 (sphere radius)
        // then mapped from [-1,1] to [0,W] / [0,H].
        const aspect = w / h;
        const sphereScale = 0.8; // cobe's `ee` constant

        const next: MarkerScreen[] = markersRef.current.map((m) => {
          const lat = (m.location[0] * Math.PI) / 180;
          const a = (m.location[1] * Math.PI) / 180 - Math.PI;
          const tx = -Math.cos(lat) * Math.cos(a);
          const ty = Math.sin(lat);
          const tz = Math.cos(lat) * Math.sin(a);

          const cosP = Math.cos(currentPhi);
          const sinP = Math.sin(currentPhi);
          const cx_ndc = cosP * tx + sinP * tz;
          const cy_ndc = ty;
          const z_view = -sinP * tx + cosP * tz;

          // cobe shader: y_screen = (cx_ndc / aspect * scale + 1)/2  (in [0,1])
          //              y_pixel  = y_ndc * height
          const xNorm = (cx_ndc / aspect) * sphereScale; // [-1,1]
          const yNorm = -cy_ndc * sphereScale; // [-1,1], y inverted for screen
          const x = ((xNorm + 1) / 2) * w;
          const y = ((yNorm + 1) / 2) * h;

          return {
            id: m.id,
            x,
            y,
            visible: z_view >= 0,
          };
        });
        setScreenMarkers(next);
      }

      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <style>{`
        @keyframes globe-pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
        @keyframes globe-dot-blink {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.85); }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1s ease",
          contain: "layout paint size",
        }}
      />
      {screenMarkers.map((m) => {
        const isActive = m.id === activeId;
        const color = isActive ? "#22e07a" : "#ff7a1a";
        return (
          <div
            key={m.id}
            style={{
              position: "absolute",
              left: m.x,
              top: m.y,
              pointerEvents: "none",
              opacity: m.visible ? 1 : 0,
              transition: "opacity 0.25s",
              zIndex: 5,
            }}
          >
            {isActive && (
              <>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: `2px solid ${color}`,
                    transform: "translate(-50%, -50%)",
                    animation: "globe-pulse-ring 1.6s ease-out infinite",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: `2px solid ${color}`,
                    transform: "translate(-50%, -50%)",
                    animation: "globe-pulse-ring 1.6s ease-out 0.8s infinite",
                  }}
                />
              </>
            )}
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 ${isActive ? 14 : 8}px ${color}, 0 0 0 2px #000`,
                transform: "translate(-50%, -50%)",
                animation: isActive
                  ? "globe-dot-blink 1.2s ease-in-out infinite"
                  : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
