// src/components/members/AegaLearningPath.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const learningPathItems = [
  {
    title: 'Core Compliance Induction:',
    description: 'Mandatory initial training on global ethics, transparency, and the "Integrity First" recruitment pledge.',
    image: '/training/presentation-1.jpg'
  },
  {
    title: 'Layer 3 Business Overview:',
    description: 'Going beyond promotional tactics to focus on the business architecture, systems, and transformation needed to keep students safe and institutions confident.',
    image: '/training/audience.jpg'
  },
  {
    title: 'Mandatory CPD Hours:',
    description: 'A fresh thought process for the sector requiring a set amount of training hours to be achieved over a rolling 12-month period to maintain active certification.',
    image: '/training/video-1.jpg'
  }
];

export default function AegaLearningPath() {
  return (
    <section className="relative px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="mb-16 text-4xl font-bold text-white lg:mb-20 lg:text-5xl">
          THE AEGA LEARNING PATH
        </h2>

        {/* Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
          {/* Left Side - Image with Brown Accent */}
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 bg-gradient-to-br from-[#8B4513] to-[#6B3410] lg:h-48 lg:w-48" />
            
            <div className="relative overflow-hidden rounded-sm">
              <div className="aspect-[4/5]">
                <Image
                  src="/presentation.jpg"
                  alt="AEGA Training Presentation"
                  width={400}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col justify-center space-y-10 lg:space-y-12">
            {learningPathItems.map((item, index) => (
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
        </div>
      </div>
    </section>
  );
}
