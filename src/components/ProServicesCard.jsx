import { useState } from "react";


import { MILKER_B64 } from "./milker-font";
const services = [
  { name: "Full Website Sprint", tags: "EFFORTLESS EXECUTION, RAPID RESULTS", dots: 1 },
  { name: "Motion Design", tags: "INTERACTION DESIGN, USABILITY AUDITS", dots: 2 },
  { name: "Full Design Package", tags: "LOGO CREATION, TYPOGRAPHY, MATERIALS", dots: 3 },
  { name: "React Development", tags: "FULL WEBSITE DEVELOPMENT", dots: 4 },
  { name: "Web Design", tags: "FIGMA FILE, SKETCH FILE", dots: 5 },
];

const DOT_COUNT = 5;

function DotIndicator({ filled }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i < filled ? "10px" : "8px",
            height: i < filled ? "10px" : "8px",
            borderRadius: "50%",
            background: i < filled ? "#fff" : "rgba(255,255,255,0.18)",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function ProServicesCard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap');

        @font-face {
          font-family: 'Milker';
          src: url('data:font/otf;base64,${MILKER_B64}') format('opentype');
          font-weight: 400;
          font-style: normal;
        }

        .ps-card {
          position: relative;
          background: #000000;
          border-radius: 24px;
          padding: 24px;
          width: 100%;
          margin: 0 auto;
          font-family: 'Barlow', sans-serif;
          overflow: hidden;
        }

        .ps-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: rgba(255,255,255,0.12);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .ps-title {
          font-family: 'Milker', sans-serif;
          font-weight: 400;
          font-size: 40px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #fff;
          text-transform: uppercase;
          margin: 0;
          text-align: right;
        }

        .ps-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
          gap: 24px;
        }

        .ps-subtitle {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
          max-width: 240px;
          flex-shrink: 0;
          padding-bottom: 4px;
        }

        .ps-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 0;
        }

        .ps-item {
          display: grid;
          grid-template-columns: 80px 1fr;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .ps-item:last-child {
          border-bottom: none;
        }

        .ps-item-center {
          min-width: 0;
          text-align: left;
        }

        .ps-item-name {
          font-family: 'Barlow', sans-serif;
          font-weight: 500;
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          margin: 0 0 4px;
          letter-spacing: 0;
        }

        .ps-item-tags {
          font-family: 'Barlow', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .ps-card { padding: 32px 24px 24px; }
          .ps-header { flex-direction: column; align-items: flex-end; }
          .ps-title { order: 1; }
          .ps-subtitle { max-width: 100%; text-align: right; order: 2; }
          .ps-item { grid-template-columns: 72px 1fr; }
        }
      `}</style>

      <div className="ps-card">

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="ps-header">
            <p className="ps-subtitle">
              
            </p>
            <h1 className="ps-title">
              what do<br />i do?
            </h1>
          </div>

          <hr className="ps-divider" />

          {services.map((s, i) => (
            <div key={i} className="ps-item">
              <DotIndicator filled={s.dots} />
              <div className="ps-item-center">
                <p className="ps-item-name">{s.name}</p>
                <p className="ps-item-tags">{s.tags}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
