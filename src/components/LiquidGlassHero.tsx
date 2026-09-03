import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useRouter } from '../lib/router';

export const LiquidGlassHero: React.FC = () => {
  const heroBoxRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { navigate } = useRouter();

  useEffect(() => {
    if (shouldReduceMotion || !heroBoxRef.current) return;

    const K = 50;
    const jelloState = {
      el: heroBoxRef.current,
      scaleX: 1,
      scaleY: 1,
      skewY: 0,
      vScaleX: 0,
      vScaleY: 0,
      vSkewY: 0,
      damping: 12,
    };

    let lastT: number | null = null;
    let isAnimating = false;
    let rAfId: number | null = null;

    function tick(ts: number) {
      if (!lastT) lastT = ts;
      const dt = Math.min((ts - lastT) / 1000, 0.05);
      lastT = ts;

      const D = jelloState.damping;

      const axX = -K * (jelloState.scaleX - 1) - D * jelloState.vScaleX;
      jelloState.vScaleX += axX * dt;
      jelloState.scaleX += jelloState.vScaleX * dt;

      const axY = -K * (jelloState.scaleY - 1) - D * jelloState.vScaleY;
      jelloState.vScaleY += axY * dt;
      jelloState.scaleY += jelloState.vScaleY * dt;

      const axS = -K * jelloState.skewY - D * jelloState.vSkewY;
      jelloState.vSkewY += axS * dt;
      jelloState.skewY += jelloState.vSkewY * dt;

      jelloState.el.style.transform = `scaleX(${jelloState.scaleX.toFixed(5)}) scaleY(${jelloState.scaleY.toFixed(5)}) skewY(${jelloState.skewY.toFixed(4)}deg)`;

      const isAlive =
        Math.abs(jelloState.vScaleX) > 0.0008 ||
        Math.abs(jelloState.scaleX - 1) > 0.0008 ||
        Math.abs(jelloState.vScaleY) > 0.0008 ||
        Math.abs(jelloState.scaleY - 1) > 0.0008 ||
        Math.abs(jelloState.vSkewY) > 0.005 ||
        Math.abs(jelloState.skewY) > 0.005;

      if (isAlive) {
        rAfId = requestAnimationFrame(tick);
      } else {
        jelloState.scaleX = 1;
        jelloState.scaleY = 1;
        jelloState.skewY = 0;
        jelloState.vScaleX = 0;
        jelloState.vScaleY = 0;
        jelloState.vSkewY = 0;
        jelloState.el.style.transform = '';
        isAnimating = false;
        lastT = null;
      }
    }

    function startAnim() {
      if (!isAnimating) {
        isAnimating = true;
        lastT = null;
        rAfId = requestAnimationFrame(tick);
      }
    }

    function fireJello(strength: number, direction: number) {
      jelloState.damping = 10 - strength * 7.5;
      jelloState.vScaleY += direction * (0.35 + strength * 0.8);
      jelloState.vScaleX -= direction * (0.18 + strength * 0.38);
      jelloState.vSkewY += 0.45 + strength * 2.3;
      startAnim();
    }

    let accumulated = 0;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    function onScroll(delta: number) {
      accumulated += Math.abs(delta);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => onScrollEnd(delta > 0 ? 1 : -1), 120);
    }

    function onScrollEnd(direction: number) {
      if (accumulated < 3) {
        accumulated = 0;
        return;
      }
      const strength = Math.min(Math.log1p(accumulated / 55) / Math.log1p(800 / 55), 1);
      fireJello(strength, direction);
      accumulated = 0;
    }

    const handleWheel = (e: WheelEvent) => onScroll(e.deltaY);

    let lastTY: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      lastTY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (lastTY === null) return;
      const dy = lastTY - e.touches[0].clientY;
      lastTY = e.touches[0].clientY;
      if (Math.abs(dy) < 1) return;
      onScroll(dy * 4);
    };
    const handleTouchEnd = () => {
      lastTY = null;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) return;
      jelloState.damping = 8;
      jelloState.vScaleY += 0.3;
      jelloState.vScaleX -= 0.15;
      jelloState.vSkewY += 0.5;
      startAnim();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    const heroEl = heroBoxRef.current;
    heroEl.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (heroEl) heroEl.removeEventListener('click', handleClick);
      if (rAfId) cancelAnimationFrame(rAfId);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="hero">
      <div className="liquidGlass-wrapper" id="jelloHeroBox" ref={heroBoxRef}>
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>

        <div className="liquidGlass-text">
          <div className="hero-content">
            <img
              src="images/chemicallogo.png"
              alt="LDCE Logo"
              className="hero-logo"
              fetchPriority="high"
              decoding="async"
            />
            <div className="badge">
              <Sparkles size={14} /> Est. 1974
            </div>
            <h1>
              Department of <span>Chemical Engineering</span>
            </h1>
            <h2>L.D. College of Engineering, Ahmedabad</h2>
            <p>
              Pioneering chemical process education, industrial safety, and sustainable innovation
              for over 50 years.
            </p>
            <div className="hero-buttons">
              <a
                href="#/courses"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/courses');
                }}
              >
                Explore Programs <ArrowRight size={14} />
              </a>
              <a
                href="#/notices"
                className="btn btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/notices');
                }}
              >
                Latest Notices
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden SVG Filter Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves={1} seed={5} result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
            <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
            <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
          <feSpecularLighting in="softMap" surfaceScale={5} specularConstant={1} specularExponent={100} lightingColor="white" result="specLight">
            <fePointLight x={-200} y={-200} z={300} />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale={10} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </section>
  );
};