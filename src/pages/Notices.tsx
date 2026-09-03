import React from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { NOTICES } from '../data/content';

export const Notices: React.FC = () => {
  return (
    <main className="page-container">
      <SectionHeader
        badge="Official Announcements"
        title="Department Notice Board"
        subtitle="Stay up to date with schedules, submissions, and GTU circulars."
      />

      <div className="notice-list" style={{ maxWidth: 850, margin: '0 auto' }}>
        {NOTICES.map((note, i) => (
          <Reveal key={note.title} delay={i * 0.09}>
            <div className="notice-item">
              <span className="notice-date">{note.date}</span>
              <h4>{note.title}</h4>
              <p>{note.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
};