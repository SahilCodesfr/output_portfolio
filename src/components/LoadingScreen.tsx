import { useEffect, useState } from "react";
import "./LoadingScreen.css";

interface LoadingProps {
  percent: number;
  onComplete: () => void;
}

const LoadingScreen = ({ percent, onComplete }: LoadingProps) => {
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent >= 100) {
      const t1 = setTimeout(() => {
        setLoaded(true);
        const t2 = setTimeout(() => {
          setClicked(true);
          const t3 = setTimeout(() => {
            onComplete();
          }, 900);
          return () => clearTimeout(t3);
        }, 1000);
        return () => clearTimeout(t2);
      }, 600);
      return () => clearTimeout(t1);
    }
  }, [percent, onComplete]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      {/* Header with logo and mini game animation */}
      <div className="ls-header">
        <a href="/" className="ls-logo-title">
          SAHIL<span>®</span>
        </a>
        <div className={`ls-loader-game ${clicked ? "ls-loader-out" : ""}`}>
          <div className="ls-loader-game-container">
            <div className="ls-loader-game-in">
              {[...Array(27)].map((_, index) => (
                <div className="ls-loader-game-line" key={index}></div>
              ))}
            </div>
            <div className="ls-loader-game-ball"></div>
          </div>
        </div>
      </div>

      {/* Main loading screen */}
      <div className="ls-screen">
        {/* Scrolling marquee text */}
        <div className="ls-marquee">
          <div className="ls-marquee-track">
            <span>A Creative Developer</span>
            <span>A Creative Designer</span>
            <span>A Creative Developer</span>
            <span>A Creative Designer</span>
            <span>A Creative Developer</span>
            <span>A Creative Designer</span>
            <span>A Creative Developer</span>
            <span>A Creative Designer</span>
          </div>
        </div>

        {/* Loading pill button */}
        <div
          className={`ls-wrap ${clicked ? "ls-clicked" : ""}`}
          onMouseMove={handleMouseMove}
        >
          <div className="ls-hover-glow"></div>
          <div className={`ls-button ${loaded ? "ls-complete" : ""}`}>
            <div className="ls-container">
              <div className="ls-content">
                <div className="ls-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="ls-box"></div>
            </div>
            <div className="ls-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;

/* ─── Progress driver ─────────────────────────────────────────────────────── */
export const driveProgress = (setPercent: (v: number) => void) => {
  let percent = 0;

  // Phase 1: fast ramp to ~50 %
  let interval = setInterval(() => {
    if (percent <= 50) {
      percent = Math.min(50, percent + Math.round(Math.random() * 5));
      setPercent(percent);
    } else {
      clearInterval(interval);

      // Phase 2: slow crawl to 91 %
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setPercent(percent);
        if (percent > 91) clearInterval(interval);
      }, 2000);
    }
  }, 100);

  /** Call when actual resources are ready — races to 100 and resolves */
  function finish(): Promise<number> {
    return new Promise((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setPercent(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }

  /** Immediately jump to 100 (use when you don't need the smooth race) */
  function forceComplete() {
    clearInterval(interval);
    setPercent(100);
  }

  return { finish, forceComplete };
};
