"use client";

import Image from "next/image";

interface ComplianceHeroProps {
  data?: {
    title?: string;
    description?: string;
  };
}

export default function ComplianceHero({ data }: ComplianceHeroProps) {
  const title = data?.title || "COMPLIANCE COURSES";
  const description = data?.description || "Comprehensive CPD training for agents, universities, and compliance professionals";

  return (
    <section className="relative w-full bg-[#03091F] py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 md:px-10 relative z-10">
        <div className="max-w-4xl text-left">
          <p className="text-[11px] md:text-xs font-semibold text-white/70 uppercase tracking-[0.25em] mb-4">
            COMPLIANCE & COURSES
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-[66px] font-bold text-white uppercase tracking-tight leading-none mb-6">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed max-w-3xl mb-6">
            {description}
          </p>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-2xl">
            In partnership with <strong>ICEF Academy</strong>, AEGA provides direct access to world-recognized professional training courses and qualifications designed specifically for the international education industry.
          </p>
        </div>
      </div>

      {/* Right Diagonal Orange Shape */}
      <div className="pointer-events-none absolute right-0 top-0 h-auto w-auto z-0">
        <Image
          src="/members-design.png"
          alt="Background"
          width={900}
          height={600}
          className="h-auto w-auto object-contain opacity-80"
          priority
        />
      </div>

      {/* Mobile Orange Accent */}
      <div className="md:hidden absolute bottom-0 right-0 w-48 h-48 bg-linear-to-tl from-[#F68E2D] to-[#D97B3C] opacity-20 rounded-full blur-3xl z-0"></div>
    </section>
  );
}
