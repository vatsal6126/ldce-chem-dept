import React from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { COURSES } from '../data/content';

export const Courses: React.FC = () => {
  return (
    <main className="page-container">
      <SectionHeader
        badge="Academic Programs"
        title="Curriculum & Degree Offerings"
        subtitle="Comprehensive GTU-accredited programs designed for modern chemical industries."
      />

      <div className="notice-list" style={{ maxWidth: 850, margin: '0 auto' }}>
        {COURSES.map((course, i) => (
          <Reveal key={course.title} delay={i * 0.09}>
            <div className="content-card">
              <span className={`badge-tag ${course.altTag ? 'alt' : ''}`}>{course.tag}</span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
};