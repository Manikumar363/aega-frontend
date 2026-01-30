import React from 'react';
import Image from 'next/image';
import { ArrowDownRight, Check } from 'lucide-react';

export const WhyAEGA = () => {
  return (
    <section className="relative py-20 bg-zinc-800 flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/why-aega.jpeg"
          alt="Why AEGA Background"
          fill
          className="object-cover"
        />
      </div>
      {/* Removed dark overlay to keep image visible */}
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4">
        <h2 className="text-5xl font-light text-white/90 mb-8 drop-shadow-lg">WHY AEGA</h2>
        <p className="text-xl md:text-xl text-white/80 leading-relaxed font-light drop-shadow-md">
          The first global alliance built specifically for the student recruitment sector.<br/> Where traditional organisations stop, AEGA steps in bridging <br/> operational gaps, improving compliance, and ensuring safer, more <br/> sustainable international mobility.
        </p>
        <div className="pt-6 items-center justify-center flex">
            <button className="bg-[#F58A07] hover:bg-[#d67806] text-white text-[13px] font-bold px-4 py-3 flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 uppercase">
              Join Us Now
              <ArrowDownRight className="w-6 h-6" />
            </button>
        </div>
        {/* Three Steps with Check Icons - now directly under button */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 mt-20 px-4">
          <div className="flex items-center gap-3">
            <Check size={28} className="text-white" />
            <span className="text-white/60 font-bold text-lg md:text-xs uppercase">Proven Strategies for Growth</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={28} className="text-white" />
            <span className="text-white/60 font-bold text-lg md:text-xs uppercase">Expert Insights Into Markets</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={28} className="text-white" />
            <span className="text-white/60 font-bold text-lg md:text-xs uppercase">Tools for Stability and Resilience</span>
          </div>
        </div>
      </div>
    </section>
  );
};