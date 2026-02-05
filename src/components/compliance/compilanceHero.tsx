import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function ComplianceHero() {
  return (
    <section className="relative w-full bg-[#03091F] py-16 md:py-24 overflow-hidden">
      {/* Background diagonal shape */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-orange-500/10 to-transparent skew-x-12"></div>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-10 relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <p className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
            COMPLIANCE & COURSES
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            COMPLIANCE COURSES
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            Comprehensive CPD training for agents, universities, and compliance professionals
          </p>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-12">
          {/* Training Category */}
          <div>
            <label className="text-sm font-semibold text-white/80 block mb-3">
              Training Category
            </label>
            <button className="w-full bg-transparent border border-white/20 rounded px-4 py-3 text-white/80 flex items-center justify-between hover:border-white/40 transition">
              Training Category
              <ChevronRight size={18} className="opacity-60" />
            </button>
          </div>

          {/* Participation Type */}
          <div>
            <label className="text-sm font-semibold text-white/80 block mb-3">
              Participation Type
            </label>
            <button className="w-full bg-transparent border border-white/20 rounded px-4 py-3 text-white/80 flex items-center justify-between hover:border-white/40 transition">
              Participation Type
              <ChevronRight size={18} className="opacity-60" />
            </button>
          </div>

          {/* Training Format */}
          <div>
            <label className="text-sm font-semibold text-white/80 block mb-3">
              Training Format
            </label>
            <button className="w-full bg-transparent border border-white/20 rounded px-4 py-3 text-white/80 flex items-center justify-between hover:border-white/40 transition">
              Training Format
              <ChevronRight size={18} className="opacity-60" />
            </button>
          </div>

          {/* Training Duration */}
          <div>
            <label className="text-sm font-semibold text-white/80 block mb-3">
              Training Duration
            </label>
            <button className="w-full bg-transparent border border-white/20 rounded px-4 py-3 text-white/80 flex items-center justify-between hover:border-white/40 transition">
              Training Duration
              <ChevronRight size={18} className="opacity-60" />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-start md:justify-start">
          <button className="bg-[#F68E2D] hover:bg-[#E87A1F] text-white font-semibold px-8 py-3 rounded transition">
            SEARCH
          </button>
        </div>
      </div>

      {/* Mobile Orange Accent */}
      <div className="md:hidden absolute bottom-0 right-0 w-48 h-48 bg-linear-to-tl from-[#F68E2D] to-[#D97B3C] opacity-20 rounded-full blur-3xl"></div>
    </section>
  );
}
