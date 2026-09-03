import React from 'react';
import { Mail } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { FACULTY } from '../data/content';

export const Department: React.FC = () => {
  return (
    <main className="page-container">
      <SectionHeader
        badge="Faculty Directory"
        title="Our Professors & Mentors"
        subtitle="Experienced educators and researchers driving chemical academic excellence."
      />

      <div className="faculty-grid">
        {FACULTY.map((fac, i) => (
          <Reveal key={fac.name} delay={i * 0.08} style={{ height: '100%' }}>
            <div className="faculty-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <img
                src={fac.image}
                alt={fac.name}
                className="faculty-img"
                loading="lazy"
                decoding="async"
              />
              <h3>{fac.name}</h3>
              <p className="role">{fac.role}</p>
              <a href={`mailto:${fac.email}`} className="email" style={{ marginTop: 'auto' }}>
                <Mail size={13} /> {fac.email}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
};