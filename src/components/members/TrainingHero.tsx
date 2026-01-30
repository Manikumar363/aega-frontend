// src/components/members/TrainingHero.tsx
import React from 'react';

export default function TrainingHero() {
  return (
    <section className="relative px-6 pb-20 pt-32 lg:px-12 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <span>FOR MEMBERS</span>
          <span className="text-orange-400">›</span>
          <span className="text-orange-400">Training Overview</span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-8 max-w-3xl text-5xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
          TRAINING OVERVIEW
        </h1>

        {/* Description Paragraphs */}
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-gray-300 lg:text-lg">
          <p>
            At AEGA, we believe that education does our ideals, and neither does the responsibility to protect it. Our
            training is the most from "traitor as a comprehensive professional development (CPD) journey designed to
            enhance skills, credibility, and ethical excellence.
          </p>
          <p>
            Through our UK-based technology hub and strategic headquarters in Dubai, we deliver a structured
            curriculum that serves as the strategic and cultural backbone for student agents and Sponsors alike.
          </p>
        </div>
      </div>
    </section>
  );
}
