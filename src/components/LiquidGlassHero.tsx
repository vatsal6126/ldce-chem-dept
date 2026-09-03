import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const LiquidGlassHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Manual High-Performance Physics Engine (forces GPU redraws on mobile)
  const fireJello = () => {
    const el = heroRef.current;
    if (!el) return;

    let scaleX = 1, scaleY = 1, skewY = 0;
    let vScaleX = -0.12, vScaleY = 0.2, vSkewY = 0.4;
    let lastT: number | null = null;
    const K = 90; // Spring tension
    const D = 6;  // Spring damping

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

      // Force 3D hardware acceleration composite layer 
      el.style.transform = `translateZ(0) scaleX(${scaleX.toFixed(4)}) scaleY(${scaleY.toFixed(4)}) skewY(${skewY.toFixed(3)}deg)`;

      if (Math.abs(vScaleX) > 0.001 || Math.abs(scaleX - 1) > 0.001 || Math.abs(vSkewY) > 0.01) {
        requestAnimationFrame(tick);
      } else {
        el.style.transform = 'translateZ(0)';
      }
    };
    requestAnimationFrame(tick);
  };

  // Bind to scrolling so it wiggles when the user swipes on their phone
  useEffect(() => {
    let lastScroll = window.scrollY;
    
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScroll) > 60) {
        fireJello();
        lastScroll = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero">
      <div 
        ref={heroRef}
        className="liquidGlass-wrapper hero-card"
        style={{ willChange: 'transform' }}
        onMouseEnter={fireJello}
        onTouchStart={fireJello} /* Triggers instantly on mobile tap */
        onClick={fireJello}
      >
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>
        
        <div className="liquidGlass-text">
          <img src="./chemicallogo.png" alt="Chemical Engineering Logo" className="hero-logo" />
          <h1>Department of<br /><span>Chemical Engineering</span></h1>
          <p>L.D. College of Engineering, Ahmedabad</p>
          <div className="hero-subtext">
            Pioneering chemical process education, industrial safety, and sustainable innovation for over 50 years.
          </div>
          
          <div className="hero-buttons">
            <a href="#/courses" className="btn-primary">Explore Programs &rarr;</a>
            <a href="#/notices" className="btn-secondary">Latest Notices</a>
          </div>
        </div>
      </div>
    </section>
  );
};