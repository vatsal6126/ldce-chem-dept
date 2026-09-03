import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Users, Calendar, Bell, Menu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from '../lib/router';
import type { Route } from '../lib/router';

const NAV_ITEMS: { label: string; path: Route; icon: LucideIcon }[] = [
  { label: 'HOME', path: '/', icon: Home },
  { label: 'COURSE INFO', path: '/courses', icon: BookOpen },
  { label: 'DEPARTMENT & STAFF', path: '/department', icon: Users },
  { label: 'EVENTS', path: '/events', icon: Calendar },
  { label: 'NOTICE BOARD', path: '/notices', icon: Bell },
];

export const Navbar: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
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
    navigate(path);
    if (isScrolled) setIsExpanded(false);
  };

  return (
    <header className="glass-dock-header">
      {/* Container uses Framer Motion layout animation for instant 60fps mobile morphing */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 450, // High stiffness for snappy responsiveness on mobile
          damping: 22,    // Tuned damping for responsive spring bounce without lag
          mass: 0.6,
        }}
        className={`glass-dock-wrapper glass-dock ${isCollapsed ? 'collapsed' : ''}`}
      >
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>

        <div className="liquidGlass-text">
          {isCollapsed ? (
            <motion.button
              key="hamburger"
              layout="position"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.85 }} // Instant touch feedback on mobile
              transition={{ duration: 0.15 }}
              className="glass-dock__hamburger-btn"
              onClick={() => setIsExpanded(true)}
              aria-label="Open Navigation"
            >
              <Menu size={20} className="glass-dock__icon" />
            </motion.button>
          ) : (
            <motion.div
              key="nav-options"
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="glass-dock__options"
            >
              {/* Active Sliding Indicator Pill */}
              <motion.div
                className="glass-dock__active-slider"
                animate={{ x: activeIndex * 44 }}
                transition={{
                  type: 'spring',
                  stiffness: 550,
                  damping: 28,
                }}
              />

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.path;

                return (
                  <motion.button
                    key={item.path}
                    whileTap={{ scale: 0.88 }} // Active touch squishy feel for every icon
                    className={`glass-dock__item ${isActive ? 'active' : ''}`}
                    title={item.label}
                    onClick={() => handleSelect(item.path)}
                  >
                    <Icon size={19} className="glass-dock__icon" />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </header>
  );
};