// src/app/(marketing)/members/regulation-compliance/page.tsx
'use client';

import Image from "next/image";

export default function RegulationCompliancePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03091F]">
      {/* Brown diagonal shape - TOP RIGHT */}
      <div className="pointer-events-none absolute right-0 top-0">
        <Image
          src="/common/bg-right-shape.png"
          alt=""
          width={1900}
          height={700}
          className="object-contain"
          priority
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-6 pb-20 pt-32 lg:px-12 lg:pt-40">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
              <span>FOR MEMBERS</span>
              <span className="text-orange-400">›</span>
              <span className="text-orange-400">REGULATION & COMPLIANCE</span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-8 max-w-3xl text-5xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
              REGULATION & COMPLIANCE
            </h1>

            {/* Description */}
            <div className="max-w-3xl space-y-6 text-base leading-relaxed text-gray-300 lg:text-lg">
              <p>
                In a shifting regulatory world, compliance is no longer an afterthought—it is the strategic foundation of
                business longevity. AEGA provides the "strategic and operational backbone" needed to navigate complex
                global frameworks, ensuring that every partner in the alliance operates with precision, integrity, and
                discipline.
              </p>
            </div>
          </div>
        </section>

        {/* Navigating Section */}
        <section className="relative px-6 py-20 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl">
            {/* Section Title */}
            <h2 className="mb-16 text-4xl font-bold text-white lg:mb-20 lg:text-5xl">
              NAVIGATING THE GLOBAL REGULATORY LANDSCAPE
            </h2>

            {/* Grid Layout */}
            <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
              {/* Left Side - Image */}
              <div className="relative">
                <Image
                  src="/members/regulation-image.png"
                  alt="Regulatory Landscape"
                  width={400}
                  height={500}
                  className="h-auto w-full object-contain"
                />
              </div>

              {/* Right Side - Content */}
              <div className="flex flex-col justify-center space-y-10 lg:space-y-12">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white lg:text-2xl">
                    1. The UKVI Basic Compliance Assessment (BCA) Framework
                  </h3>
                  <p className="text-base leading-relaxed text-gray-300 lg:text-lg">
                    With the major shifts announced in 2025, the thresholds for Sponsor survival have tightened significantly. AEGA
                    ensures both Agents and Sponsors understand how these metrics are now directly linked to agent performance.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white lg:text-2xl">
                    2. Alignment with Global Agent Quality Frameworks
                  </h3>
                  <p className="text-base leading-relaxed text-gray-300 lg:text-lg">
                    AEGA integrates the highest international standards into a single, auditable "Layer 3" business model.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white lg:text-2xl">
                    3. Real-Time Compliance Technology
                  </h3>
                  <p className="text-base leading-relaxed text-gray-300 lg:text-lg">
                    Through our UK-based technology hub, we provide the digital infrastructure for defensible compliance.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white lg:text-2xl">
                    4. Professional Integrity & The AEGA Pledge
                  </h3>
                  <p className="text-base leading-relaxed text-gray-300 lg:text-lg">
                    The alliance is built on a "rolling-grade" commitment to ethics, as recognized by our founder's 2021 national award
                    for military values in business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
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
                "MAXWELL HARPER'S INSIGHTS HAVE TRANSFORMED MY INVESTMENT APPROACH. HIS STRATEGIES HELPED ME GROW MY
                PORTFOLIO BY 30% IN SIX MONTHS, AND I FEEL CONFIDENT NAVIGATING EVEN VOLATILE MARKETS."
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
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center justify-center opacity-60 grayscale">
                  <Image
                    src={`/logos/logoipsum-${num}.svg`}
                    alt="Logoipsum"
                    width={120}
                    height={40}
                    className="h-auto w-full max-w-[120px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-6 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  READY TO UNLOCK YOUR INVESTMENT POTENTIAL?
                </div>
                <h2 className="text-4xl font-bold text-white lg:text-5xl">
                  LET'S GET STARTED
                </h2>
              </div>
              <button className="rounded bg-orange-500 px-8 py-4 font-semibold text-white transition-colors hover:bg-orange-600">
                REGISTER NOW →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
