import React from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { EVENTS } from '../data/content';

export const Events: React.FC = () => {
  return (
    <main className="page-container">
      <SectionHeader
        badge="Activities & Exposure"
        title="Departmental Events"
        subtitle="Connecting classroom theory with industrial practices and research trends."
      />

      <div className="notice-list" style={{ maxWidth: 850, margin: '0 auto' }}>
        {EVENTS.map((ev, i) => (
          <Reveal key={ev.title} delay={i * 0.09}>
            <div className="content-card">
              <span className={`badge-tag ${ev.altTag ? 'alt' : ''}`}>{ev.tag}</span>
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
};
