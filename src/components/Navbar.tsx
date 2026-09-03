import React, { useEffect, useRef, useState } from 'react';
import { Home, BookOpen, Users, Calendar, Bell, Menu } from 'lucide-react';
import { useRouter } from '../lib/router';
import type { Route } from '../lib/router';

const NAV_ITEMS: { label: string; path: Route; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { label: 'HOME', path: '/', icon: Home },
  { label: 'COURSE INFO', path: '/courses', icon: BookOpen },
  { label: 'DEPARTMENT & STAFF', path: '/department', icon: Users },
  { label: 'EVENTS', path: '/events', icon: Calendar },
  { label: 'NOTICE BOARD', path: '/notices', icon: Bell },
];

export const Navbar: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const dockRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // High-Impact Jello Physics Engine
  const fireJello = (multiplier = 1) => {
    if (!dockRef.current) return;
    const el = dockRef.current;

    let scaleX = 1;
    let scaleY = 1;
    let skewY = 0;
    
    let vScaleX = -0.35 * multiplier;
    let vScaleY = 0.65 * multiplier;
    let vSkewY = 1.2 * multiplier;
    
    let lastT: number | null = null;
    const K = 90;
    const D = 6.5;

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

      el.style.transform = `scaleX(${scaleX.toFixed(5)}) scaleY(${scaleY.toFixed(5)}) skewY(${skewY.toFixed(4)}deg)`;

      const isAlive =
        Math.abs(vScaleX) > 0.0008 ||
        Math.abs(scaleX - 1) > 0.0008 ||
        Math.abs(vScaleY) > 0.0008 ||
        Math.abs(scaleY - 1) > 0.0008 ||
        Math.abs(vSkewY) > 0.005 ||
        Math.abs(skewY) > 0.005;

      if (isAlive) {
        requestAnimationFrame(tick);
      } else {
        el.style.transform = '';
      }
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = NAV_ITEMS.findIndex((item) => item.path === currentRoute);
  const isCollapsed = isScrolled && !isExpanded;

  const handleSelect = (path: Route) => {
    fireJello(1.2);
    navigate(path);
    if (isScrolled) setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    fireJello(1.5);
  };

  return (
    <header className="glass-dock-header">
      <div
        className={`glass-dock-wrapper glass-dock ${isCollapsed ? 'collapsed' : ''}`}
        ref={dockRef}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.closest('button')) {
            fireJello(1);
          }
        }}
      >
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>

        <div className="liquidGlass-text">
          {isCollapsed ? (
            <button
              className="glass-dock__hamburger-btn"
              onClick={toggleExpand}
              aria-label="Open Navigation"
            >
              <Menu size={20} className="glass-dock__icon" />
            </button>
          ) : (
            <div className="glass-dock__options">
              <div
                className="glass-dock__active-slider"
                style={{
                  transform: `translateX(${activeIndex * 44}px)`,
                }}
              />

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.path;

                return (
                  <button
                    key={item.path}
                    className={`glass-dock__item ${isActive ? 'active' : ''}`}
                    title={item.label}
                    onClick={() => handleSelect(item.path)}
                  >
                    <Icon size={19} className="glass-dock__icon" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};