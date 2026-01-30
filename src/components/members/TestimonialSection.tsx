// src/components/members/TestimonialSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const logos = [
  { src: '/logos/logoipsum-1.svg', alt: 'Logoipsum' },
  { src: '/logos/logoipsum-2.svg', alt: 'Logoipsum' },
  { src: '/logos/logoipsum-3.svg', alt: 'Logoipsum' },
  { src: '/logos/logoipsum-4.svg', alt: 'Logoipsum' },
  { src: '/logos/logoipsum-5.svg', alt: 'Logoipsum' }
];

export default function TestimonialSection() {
  return (
    <section className="relative px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Small Label */}
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            WHAT OUR CLIENTS SAY
          </span>
        </div>

        {/* Testimonial Quote */}
        <blockquote className="mb-12 text-center">
          <p className="mb-8 text-2xl font-bold leading-tight text-white lg:text-3xl xl:text-4xl">
            "MAXWELL HARPER'S INSIGHTS HAVE TRANSFORMED MY INVESTMENT APPROACH. HIS STRATEGIES HELPED ME GROW MY PORTFOLIO BY 30% IN SIX MONTHS, AND I FEEL CONFIDENT NAVIGATING EVEN VOLATILE MARKETS."
          </p>
        </blockquote>

        {/* Author Info */}
        <div className="mb-16 flex items-center justify-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image
              src="/testimonials/sarah-thompson.jpg"
              alt="Sarah Thompson"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold text-white">Sarah Thompson</div>
            <div className="text-sm text-gray-400">Senior Investment Advisor</div>
          </div>
        </div>

        {/* Logo Bar */}
        <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-5 lg:gap-12">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                className="h-auto w-full max-w-[120px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
