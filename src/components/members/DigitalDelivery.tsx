// src/components/members/DigitalDelivery.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const deliveryMethods = [
  {
    title: 'SYNTHESIA VIDEO TRAINING:',
    description: 'Engaging, high-quality video modules led by AI avatars to provide consistent global training at scale.'
  },
  {
    title: 'REAL-TIME DASHBOARDS:',
    description: 'A platform that allows universities to see, in real-time, that their global partners are trained, verified, and ready to recruit.'
  },
  {
    title: 'THE DEFERRAL ENGLISH COURSE:',
    description: 'A first-of-its-kind course designed for students who missed registration, allowing Sponsors and Agents to continue supporting and preparing them for the next cohort.'
  }
];

export default function DigitalDelivery() {
  return (
    <section className="relative px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="mb-16 text-center text-4xl font-bold text-white lg:mb-20 lg:text-5xl">
          DIGITAL DELIVERY & INNOVATION
        </h2>

        {/* Large Featured Image */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-sm">
            <div className="aspect-[21/9]">
              <Image
                src="/common/man.png"
                alt="Digital Delivery Innovation"
                width={1920}
                height={823}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Three Column Cards */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {deliveryMethods.map((method, index) => (
            <div key={index} className="bg-[#0A1128] p-8 lg:p-10">
              <h3 className="mb-4 text-xl font-semibold text-white lg:text-2xl">
                {method.title}
              </h3>
              <p className="text-base leading-relaxed text-gray-300 lg:text-lg">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
