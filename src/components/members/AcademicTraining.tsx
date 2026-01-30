// src/components/members/AcademicTraining.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const trainingCards = [
  {
    number: '01.',
    title: 'NICHE COURSE DISCIPLINE TRAINING:',
    description: 'In-depth modules for Agents specializing in Business, Engineering, Social Sciences, Arts, and other critical disciplines.'
  },
  {
    number: '02.',
    title: 'PHD JOURNEY NAVIGATION:',
    description: 'Specialized training for Directors of Studies and supervisors on navigating the unique UKVI requirements of the PhD student journey.'
  },
  {
    number: '03.',
    title: 'ADMISSIONS EXCELLENCE:',
    description: 'Training for staff on overcoming admissions delays and streamlining the student journey from recruitment to graduation.'
  }
];

export default function AcademicTraining() {
  return (
    <section className="relative px-6 py-20 lg:px-12 lg:py-32">
      {/* Brown Background Shape - Top Left */}
      <div className="pointer-events-none absolute left-0 top-0">
        <Image
          src="/common/bg-left-shape.png"
          alt=""
          width={1200}
          height={800}
          className="object-contain opacity-40"
        />
      </div>

      {/* Brown Background Shape - Bottom Right */}
      <div className="pointer-events-none absolute bottom-0 right-0">
        <Image
          src="/common/bg-right-shape.png"
          alt=""
          width={1200}
          height={800}
          className="rotate-180 object-contain opacity-40"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="mb-16 text-center text-4xl font-bold text-white lg:mb-20 lg:text-5xl xl:text-6xl">
          ACADEMIC & DISCIPLINE-SPECIFIC TRAINING
        </h2>

        {/* Cards Grid */}
        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
          {trainingCards.map((card, index) => (
            <div key={index} className="border border-gray-700/50 p-8 lg:p-10">
              <h3 className="mb-4 text-xl font-semibold uppercase text-white lg:text-2xl">
                {card.title}
              </h3>
              <p className="mb-8 text-base leading-relaxed text-gray-300 lg:text-lg">
                {card.description}
              </p>
              <div className="text-5xl font-bold text-[#D2691E] lg:text-6xl">
                {card.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
