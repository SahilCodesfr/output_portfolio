import { useEffect, useRef, useState, useCallback } from "react";

import { HOUR_SRC, MINUTE_SRC, SECOND_SRC } from "./clock-assets";




// ---------------------------------------------------------------------------
// Measured pixel analysis of the 490×490 hand PNGs:
//   Hour hand:   mounting hole centre at row 244/490 = 49.80% from top
//   Minute hand: mounting hole centre at row 244/490 = 49.80% from top
//   Second hand: hub circle centre    at row 245/490 = 50.00% from top
//
// Each hand PNG is displayed at SIZE×SIZE (same as the dial),
// stacked directly on top of it. Rotating around the pivot % puts
// the hole exactly at the clock centre.
// ---------------------------------------------------------------------------

function useGlVignette(canvasRef, size) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const V = `attribute vec2 a; varying vec2 v;
      void main(){ v=a*.5+.5; gl_Position=vec4(a,0,1); }`;
    const F = `precision mediump float;
      varying vec2 v; uniform float t;
      void main(){
        vec2 p = v*2.-1.; float d = length(p);
        float vign = pow(1.0-smoothstep(0.3,1.0,d),1.6);
        float pulse = 0.5+0.5*sin(t*0.9);
        float glow  = smoothstep(0.65,0.0,d)*0.07*pulse;
        float rim   = (smoothstep(0.97,0.93,d)-smoothstep(1.0,0.98,d))*0.25;
        gl_FragColor = vec4(0,0,0,clamp(vign*0.5+glow+rim,0.,1.));
      }`;

    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, V));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, F));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "t");

    gl.viewport(0, 0, size, size);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const t0 = performance.now();
    let raf;
    const loop = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [size]);
}

function getAngles() {
  const now = new Date();
  const ms = now.getMilliseconds();
  const s  = now.getSeconds()       + ms / 1000;
  const m  = now.getMinutes()       + s  / 60;
  const h  = (now.getHours() % 12) + m  / 60;
  return { h: h * 30, m: m * 6, s: s * 6 };
}

export default function AnalogClock({ size = 420 }) {
  const [angles, setAngles] = useState(getAngles);
  const glRef = useRef(null);
  useGlVignette(glRef, size);

  useEffect(() => {
    const id = setInterval(() => setAngles(getAngles()), 40);
    return () => clearInterval(id);
  }, []);

  const base = {
    position: "absolute",
    top: 0, left: 0,
    width: size,
    height: size,
    pointerEvents: "none",
    willChange: "transform",
  };

  return (
    <div style={{
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      userSelect: "none",
      boxShadow: [
        "0 0 0 1.5px rgba(255,255,255,0.07)",
        "0 4px 12px rgba(0,0,0,0.5)",
        "0 16px 48px rgba(0,0,0,0.75)",
        "0 32px 80px rgba(0,0,0,0.5)",
      ].join(", "),
    }}>

      {/* Dial */}
      <img
        src={"/clockDial.png"}
        alt=""
        draggable={false}
        style={{ position:"absolute", top:0, left:0, width:size, height:size,
                 borderRadius:"50%", display:"block", zIndex:1 }}
      />

      {/* Hour hand — pivot at 49.80% */}
      <img
        src={HOUR_SRC}
        alt=""
        draggable={false}
        style={{
          ...base,
          zIndex: 3,
          transformOrigin: "50% 49.80%",
          transform: `rotate(${angles.h}deg)`,
          filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.95))",
        }}
      />

      {/* Minute hand — pivot at 49.80% */}
      <img
        src={MINUTE_SRC}
        alt=""
        draggable={false}
        style={{
          ...base,
          zIndex: 4,
          transformOrigin: "50% 49.80%",
          transform: `rotate(${angles.m}deg)`,
          filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.95))",
        }}
      />

      {/* Second hand — pivot at 50.00% (dead centre) */}
      <img
        src={SECOND_SRC}
        alt=""
        draggable={false}
        style={{
          ...base,
          zIndex: 5,
          transformOrigin: "50% 50.00%",
          transform: `rotate(${angles.s}deg)`,
          filter: "drop-shadow(0 1px 4px rgba(160,160,160,0.25))",
        }}
      />

      {/* Centre jewel cap */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: 12, height: 12,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle at 35% 30%, #fff, #aaa 50%, #555)",
        boxShadow: "0 0 6px rgba(0,0,0,1), 0 1px 2px rgba(0,0,0,0.8)",
        zIndex: 6,
      }}/>

      {/* WebGL vignette overlay */}
      <canvas
        ref={glRef}
        width={size}
        height={size}
        style={{ position:"absolute", top:0, left:0, borderRadius:"50%",
                 pointerEvents:"none", zIndex:7 }}
      />
    </div>
  );
}

// Demo wrapper
export function ClockDemo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 40%, #1c1c1c, #080808)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 28,
    }}>
      <AnalogClock size={420} />
      <p style={{ color:"#2a2a2a", fontSize:10, letterSpacing:".25em",
                  textTransform:"uppercase", fontFamily:"monospace" }}>
        analog · timepiece
      </p>
    </div>
  );
}
