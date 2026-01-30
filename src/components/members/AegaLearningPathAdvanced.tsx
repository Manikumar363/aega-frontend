// src/components/members/AegaLearningPathAdvanced.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const advancedItems = [
  {
    title: 'UKVI Compliance & Risk Intelligence:',
    description: 'Deep-dive training on the Sponsor Management System (SMS), CAS solutions, and managing risks within the Student Visa route.'
  },
  {
    title: 'Audit Readiness:',
    description: 'Comprehensive instruction on conducting internal health checks and preparing for institutional inspections by bodies such as UKVI or the Office for Students (OfS).'
  },
  {
    title: 'Basic Compliance Assessment (BCA) Management:',
    description: 'Specialist training on managing and understanding the migration processes of BCA metrics, such as visa refusal and enrollment rates.'
  }
];

export default function AegaLearningPathAdvanced() {
  return (
    <section className="relative px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="mb-16 text-4xl font-bold text-white lg:mb-20 lg:text-5xl">
          THE AEGA LEARNING PATH
        </h2>

        {/* Grid Layout - Reversed */}
        <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12">
          {/* Left Side - Content */}
          <div className="flex flex-col justify-center space-y-10 lg:space-y-12">
            {advancedItems.map((item, index) => (
              <div key={index}>
                <h3 className="mb-3 text-xl font-semibold text-white lg:text-2xl">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-300 lg:text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Side - Image (with brown accents included in image) */}
          <div className="relative">
            <Image
              src="/common/advance-learning.png"
              alt="AEGA Training Audience"
              width={500}
              height={667}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
