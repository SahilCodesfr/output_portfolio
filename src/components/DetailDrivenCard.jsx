import { useState, useRef } from "react";

// Image dimensions: 1310 × 930px
// Card outer: x=32, y=48, w=1246, h=834
// Card inner padding: top=52, left=68, right=68, bottom=60
// ─── Extracted measurements (all at 1x, card width ≈ 1246px) ───
// Icon circle: 52×52px, border 1.5px #2a2a2a
// Gap circle→label: 16px
// Label font: 11px tracking 0.2em uppercase #777
// "PHILOSOPHY ✦" font: 11px tracking 0.2em #555
// Topbar → content gap: 68px
// Grid: left col 44%, right col 56%, gap 0 (space-between)
// "Interfaces" font: 72px bold Playfair, color #fff, lh 1.0
// "you can feel." font: 66px italic Playfair, color #494949, lh 1.05
// H1→tagline gap: 0px (tight)
// tagline→body gap: 28px
// Body text: 16px DM Sans 300, color #848484, lh 1.72
// ─── Right col ───
// Tabs top-aligned to about 210px from card top (same row as ~midpoint of h1)
// Tab pill: height 44px, padding 0 22px, border 1.5px #2a2a2a, radius 999px
// Tab font: 15px DM Sans 400, color #666
// Active tab: filled bg, color #fff, font-weight 500
// Gap between pills: 8px
// Tabs → title gap: 32px
// Title "Attention to detail": 29px Playfair bold, color #fff, lh 1.2
// Title → desc gap: 12px
// Desc: 16px DM Sans 300, color #5e5e5e, lh 1.65, text-align right

const tabs = [
  {
    id: "motion",
    label: "Motion",
    activeBg: "#8B5CF6",
    title: "Fluid Animation",
    description: "Purposeful movement that guides attention and communicates state.",
  },
  {
    id: "type",
    label: "Type",
    activeBg: "#4F63E8",
    title: "Typography",
    description: "Clean hierarchy and rhythm for effortless scanning.",
  },
  {
    id: "feedback",
    label: "Feedback",
    activeBg: "#22C55E",
    title: "Responsiveness",
    description: "Every hover, click, and focus gets a crisp response.",
  },
  {
    id: "craft",
    label: "Craft",
    activeBg: "#E8611A",
    title: "Attention to detail",
    description: "Polish lives in the edges: spacing, timing, and states.",
  },
];

function TabButton({ tab, isActive, onClick }) {
  const [ripples, setRipples] = useState([]);
  const [pressed, setPressed] = useState(false);
  const btnRef = useRef(null);

  const addRipple = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 650);
  };

  return (
    <button
      ref={btnRef}
      className={`tab-btn${isActive ? " active" : ""}${pressed ? " pressed" : ""}`}
      style={isActive ? { "--fill": tab.activeBg } : {}}
      onPointerDown={(e) => { setPressed(true); addRipple(e); }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={onClick}
    >
      <span className="btn-label">{tab.label}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple"
          style={{
            left: r.x,
            top: r.y,
            background: isActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.09)",
          }}
        />
      ))}
    </button>
  );
}

export default function DetailDrivenCard() {
  const [activeTab, setActiveTab] = useState("craft");
  const current = tabs.find((t) => t.id === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Viewport shell ── */
        .root {
          width: 100%;
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Card ── 
           Source card is 1246px wide. We scale to max 860px for the artifact
           preview and use a fluid scale factor via font-size on :root.
           All internal sizes are in px matching the source at max-width.
        ── */
        .card {
          position: relative;
          width: 100%;
          max-width: 860px;
          background: #131313;
          border-radius: 18px;
          /* Source: 52px top, 68px L/R, 60px bottom → scaled to 860/1246 ≈ 0.69 */
          /* Fluid: clamp(min, preferred, max) */
          padding: clamp(28px, 4.2vw, 52px)   /* top */
                   clamp(28px, 5.5vw, 68px)   /* right */
                   clamp(36px, 4.8vw, 60px)   /* bottom */
                   clamp(28px, 5.5vw, 68px);  /* left */
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),   /* subtle edge definition */
            0 0 30px rgba(255,255,255,0.06),    /* outer soft glow */
            0 0 80px rgba(255,255,255,0.04);    /* spread glow */
        }

        /* ── Top bar ──
           Source: icon 52px circle, gap 16px, label 11px tracking
           Top bar bottom margin: 68px source → clamp
        ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: clamp(10px, 1.3vw, 16px);
        }

        .icon-circle {
          /* Source: 52×52px */
          width: clamp(36px, 4.2vw, 52px);
          height: clamp(36px, 4.2vw, 52px);
          border-radius: 50%;
          border: 1.5px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #7a7a7a;
        }

        .brand-label {
          /* Source: 11px, tracking 0.2em, uppercase, #777 */
          font-size: clamp(9px, 0.88vw, 11px);
          font-weight: 400;
          letter-spacing: 0.2em;
          color: #777;
          text-transform: uppercase;
        }

        .philosophy {
          display: flex;
          align-items: center;
          gap: 9px;
          /* Source: same size as brand-label */
          font-size: clamp(9px, 0.88vw, 11px);
          font-weight: 400;
          letter-spacing: 0.2em;
          color: #555;
          text-transform: uppercase;
        }

        /* ── Content grid ──
           Source: left col ≈ 44%, right col ≈ 56%
           The two columns are separated by natural whitespace, no explicit gap needed.
        ── */
        .grid {
          display: grid;
          grid-template-columns: 44fr 56fr;
          gap: 0;
          align-items: start;
        }

        @media (max-width: 520px) {
          .grid { grid-template-columns: 1fr; gap: 32px; }
          .right { align-items: flex-start !important; }
          .tabs { justify-content: flex-start !important; }
          .tab-info { text-align: left !important; }
          .tab-info p { margin-left: 0 !important; }
        }

        /* ── Left column ── */
        .left h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: clamp(40px, 5.2vw, 68px);
          line-height: 1.02;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin-bottom: 0;
        }

        .tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.02;
          color: rgba(255,255,255,0.5);
          letter-spacing: -0.015em;
          margin-bottom: 24px;
        }

        .body-text {
          font-size: 14px;
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 340px;
        }

        /* ── Right column ── */
        .right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          /* Tabs start at ~same vertical position as "Interfaces" h1
             which is already at the top of the grid, so no padding-top needed  */
          gap: 0;
        }

        /* ── Tab row ──
           Source: pills at top of right col
           gap between pills: 8px
        ── */
        .tabs {
          display: flex;
          gap: clamp(5px, 0.65vw, 8px);
          flex-wrap: wrap;
          justify-content: flex-end;
          /* Source: tabs bottom to title = 32px */
          margin-bottom: clamp(20px, 2.6vw, 32px);
        }

        /* ── Tab pill ──
           Source: h=44px, padding 0 22px, border 1.5px #2a2a2a, font 15px
        ── */
        .tab-btn {
          position: relative;
          overflow: hidden;
          height: clamp(32px, 3.5vw, 44px);
          padding: 0 clamp(14px, 1.76vw, 22px);
          border-radius: 999px;
          border: 1.5px solid #2a2a2a;
          background: transparent;
          color: #606060;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(12px, 1.2vw, 15px);
          font-weight: 400;
          cursor: pointer;
          white-space: nowrap;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            color            0.22s ease,
            border-color     0.22s ease,
            transform        0.11s ease,
            box-shadow       0.18s ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .tab-btn:hover:not(.active) {
          border-color: #3a3a3a;
          color: #999;
          background-color: #1a1a1a;
        }

        .tab-btn.active {
          background-color: var(--fill);
          border-color: transparent;
          color: #fff;
          font-weight: 500;
          box-shadow: 0 0 22px -5px var(--fill);
        }

        .tab-btn.pressed {
          transform: scale(0.92);
          box-shadow: none !important;
        }

        .btn-label {
          position: relative;
          z-index: 1;
          pointer-events: none;
        }

        .ripple {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-out 0.6s cubic-bezier(0.2, 0.6, 0.4, 1) forwards;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes ripple-out {
          to { transform: translate(-50%, -50%) scale(30); opacity: 0; }
        }

        /* ── Tab info ──
           Source: title 29px bold Playfair, desc 16px DM Sans 300 #5e5e5e
           title→desc: 12px
        ── */
        .tab-info {
          text-align: right;
          animation: fadeUp 0.2s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        .tab-info h2 {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(16px, 1.5vw, 22px);
          color: #ffffff;
          margin-bottom: clamp(6px, 0.6vw, 10px);
          line-height: 1.2;
        }

        .tab-info p {
          font-size: clamp(12px, 0.95vw, 14px);
          font-weight: 300;
          color: #5e5e5e;
          line-height: 1.55;
          margin-left: auto;
        }
      `}</style>

      <div className="root">
        <div className="card">

          {/* ── Top bar ── */}
          <div className="topbar">
            <div className="brand">
              <div className="icon-circle">
                {/* Source icon: cursor/pointer arrow, ~14px inside 52px circle */}
                <svg
                  width="15" height="15"
                  viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <span className="brand-label">Detail‑Driven UI</span>
            </div>

            <div className="philosophy">
              <span>Philosophy</span>
              {/* ✦ sparkle / 4-pointed star */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z" />
              </svg>
            </div>
          </div>

          {/* ── Two-column grid ── */}
          <div className="grid">

            {/* Left */}
            <div className="left">
              <h1>Interfaces</h1>
              <div className="tagline">you can feel.</div>
              <p className="body-text">
                I strive to create digital experiences that<br/>
                feel organic and human, where every<br/>
                pixel has a purpose.
              </p>
            </div>

            {/* Right */}
            <div className="right">

              {/* Pills */}
              <div className="tabs">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => activeTab !== tab.id && setActiveTab(tab.id)}
                  />
                ))}
              </div>

              {/* Title + description */}
              <div className="tab-info" key={current.id}>
                <h2>{current.title}</h2>
                <p>{current.description}</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
