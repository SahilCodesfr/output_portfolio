"use client";

import { useEffect, useRef } from "react";

/**
 * RubiksCard
 * ──────────
 * Personal card: rotating Rubik's cube with pure black faces
 * and glowing white edges on every cubelet.
 *
 * Install:  npm install three @types/three
 * Usage:    <RubiksCard firstName="Parth" lastName="Sharma" location="NOIDA, IN" />
 */

interface Props {
  firstName?: string;
  lastName?: string;
  location?: string;
}

export default function RubiksCard({
  firstName = "Sahil",
  lastName = "Sonkar",
  location = "KOLKATA, IN",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef   = useRef<HTMLSpanElement>(null);

  /* ── live clock ───────────────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      if (!timeRef.current) return;
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      timeRef.current.textContent =
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── three.js ─────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animId: number;

    (async () => {
      const THREE = await import("three");

      const SZ = 300;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(SZ, SZ);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(6.4, 3.6, 8.0);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      /* minimal ambient — faces must stay pure black */
      scene.add(new THREE.AmbientLight(0xffffff, 0.04));

      /* pure flat black faces — no shininess, no reflections */
      const faceMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

      /* bright white edge lines — CSS bloom makes them glow outward */
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });

      /* S = cubelet side, GAP = centre-to-centre distance
         gap between any two adjacent cubelets = GAP - S = 0.10 */
      const S   = 0.84;
      const GAP = 0.94;
      const boxGeo  = new THREE.BoxGeometry(S, S, S);
      /* edge geometry slightly oversized so lines sit proud of the face */
      const edgeGeo = new THREE.EdgesGeometry(
        new THREE.BoxGeometry(S + 0.004, S + 0.004, S + 0.004)
      );

      const group = new THREE.Group();
      group.scale.setScalar(0.85);
      scene.add(group);

      for (let x = -1; x <= 1; x++)
        for (let y = -1; y <= 1; y++)
          for (let z = -1; z <= 1; z++) {
            const pos = new THREE.Vector3(x * GAP, y * GAP, z * GAP);

            /* black face mesh */
            const face = new THREE.Mesh(boxGeo, faceMat);
            face.position.copy(pos);
            group.add(face);

            /* glowing white edges */
            const edges = new THREE.LineSegments(edgeGeo, edgeMat);
            edges.position.copy(pos);
            group.add(edges);
          }

      group.rotation.x = 0.42;
      group.rotation.y = -0.55;

      /* drag to rotate */
      let dragging = false, px = 0, py = 0;
      const onDown = (x: number, y: number) => { dragging = true; px = x; py = y; };
      const onUp   = () => { dragging = false; };
      const onMove = (x: number, y: number) => {
        if (!dragging) return;
        group.rotation.y += (x - px) * 0.013;
        group.rotation.x += (y - py) * 0.013;
        px = x; py = y;
      };
      canvas.addEventListener("mousedown",  (e) => onDown(e.clientX, e.clientY));
      window.addEventListener("mouseup",    onUp);
      window.addEventListener("mousemove",  (e) => onMove(e.clientX, e.clientY));
      canvas.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX, e.touches[0].clientY));
      canvas.addEventListener("touchend",   onUp);
      canvas.addEventListener("touchmove",  (e) => {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }, { passive: false });

      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.01;
        if (!dragging) {
          group.rotation.y += 0.006 + Math.sin(t * 0.3) * 0.001;
          group.rotation.x += 0.003 + Math.cos(t * 0.2) * 0.0005;
        }
        renderer.render(scene, camera);
      };
      animate();
    })();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Playfair+Display:ital@1&display=swap');
      `}</style>

      <div style={s.card}>
        <div style={s.textBlock}>
          <div style={s.firstName}>{firstName}</div>
          <div style={s.lastName}>{lastName}</div>
          <div style={s.locRow}>
            <svg
              width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.5)" strokeWidth={2.2}
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={s.locText}>
              {location}&nbsp;&nbsp;•&nbsp;&nbsp;<span ref={timeRef} />
            </span>
          </div>
        </div>

        {/* CSS drop-shadow blooms the white edge lines into a glow */}
        <div style={s.cubeWrap}>
          <canvas ref={canvasRef} width={260} height={260} style={s.canvas} />
        </div>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: {
    width: "100%",
    height: "100%",
    minHeight: 360,
    background: "#000000",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },

  textBlock: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    zIndex: 10,
  },

  firstName: {
    fontFamily: "'Inter',sans-serif",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 40,
    lineHeight: 1.05,
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },

  lastName: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: 32,
    lineHeight: 1.05,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "-0.01em",
    marginTop: 4,
  },

  locRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },

  locText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
  },

  /* Subtle bloom — reduced glow per design spec */
  cubeWrap: {
    position: "absolute",
    width: 260,
    height: 260,
    bottom: 20,
    left: "38%",
    top: "35%",
    transform: "translateX(-50%)",
    zIndex: 2,
    filter:
      "drop-shadow(0 0 1px rgba(255,255,255,0.5)) " +
      "drop-shadow(0 0 6px rgba(255,255,255,0.22)) " +
      "drop-shadow(0 0 18px rgba(255,255,255,0.1))",
  },

  canvas: {
    width: 260,
    height: 260,
    display: "block",
  },
};
