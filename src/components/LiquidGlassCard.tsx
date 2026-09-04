import React, { useEffect, useRef } from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  style?: React.CSSProperties;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  onClick,
  role,
  tabIndex,
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  // High-Performance Physics Engine — exact same as hero jello
  const fireJello = (strength = 1.0) => {
    const el = cardRef.current;
    if (!el) return;

    // Cancel any idle animation
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    let scaleX = 1, scaleY = 1, skewY = 0;
    let vScaleX = -0.38 * strength;
    let vScaleY = 0.55 * strength;
    let vSkewY = 1.2 * strength;
    let lastT: number | null = null;
    const K = 70;
    const D = 4.5;

    const tick = (ts: number) => {
      if (!lastT) lastT = ts;
      const dt = Math.min((ts - lastT) / 1000, 0.05);
      lastT = ts;

      const axX = -K * (scaleX - 1) - D * vScaleX;
      vScaleX += axX * dt;
      scaleX += vScaleX * dt;

      const axY = -K * (scaleY - 1) - D * vScaleY;
      vScaleY += axY * dt;
      scaleY += vScaleY * dt;

      const axS = -K * skewY - D * vSkewY;
      vSkewY += axS * dt;
      skewY += vSkewY * dt;

      el.style.transform = `translateZ(0) scaleX(${scaleX.toFixed(4)}) scaleY(${scaleY.toFixed(4)}) skewY(${skewY.toFixed(3)}deg)`;

      if (
        Math.abs(vScaleX) > 0.0005 ||
        Math.abs(scaleX - 1) > 0.0005 ||
        Math.abs(vSkewY) > 0.005 ||
        Math.abs(skewY) > 0.005
      ) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        el.style.transform = 'translateZ(0)';
        frameRef.current = null;
        startIdleBreath();
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  // Gentle continuous "breathing" idle — keeps it alive when static
  const startIdleBreath = () => {
    const el = cardRef.current;
    if (!el || frameRef.current) return;

    const start = performance.now();
    const breathTick = (ts: number) => {
      const t = (ts - start) / 1000;
      const s = 1 + Math.sin(t * 0.9) * 0.008;
      const sk = Math.sin(t * 1.1) * 0.06;
      el.style.transform = `translateZ(0) scaleX(${s.toFixed(5)}) scaleY(${(2 - s).toFixed(5)}) skewY(${sk.toFixed(4)}deg)`;
      frameRef.current = requestAnimationFrame(breathTick);
    };
    frameRef.current = requestAnimationFrame(breathTick);
  };

  useEffect(() => {
    // Kick a big jello on load so users notice it immediately
    const timeout = setTimeout(() => fireJello(1.2), 350);

    let lastScroll = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScroll) > 40) {
        fireJello(0.8);
        lastScroll = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`liquidGlass-wrapper liquidGlass-card ${className}`}
      style={{ willChange: 'transform', ...style }}
      onMouseEnter={() => fireJello(0.85)}
      onTouchStart={() => fireJello(1.0)}
onClick={() => {
        fireJello(1.0);
        onClick?.();
      }}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick();
        }
      }}
      role={role}
      tabIndex={tabIndex}
    >
      <div className="liquidGlass-effect" />
      <div className="liquidGlass-tint" />
      <div className="liquidGlass-shine" />
      <div className="liquidGlass-text">{children}</div>
    </div>
  );
};