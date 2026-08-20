import React from 'react';
import Image from 'next/image';
import { ArrowDownRight, Check } from 'lucide-react';

interface WhyAEGAProps {
  data?: {
    description?: string;
    image?: string;
    bottomTitles?: string[];
  };
}

export const WhyAEGA = ({ data }: WhyAEGAProps) => {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/landingPage/why-aega.png");

  const description = data?.description || "The first global alliance built specifically for the student recruitment sector. Where traditional organisations stop, AEGA steps in bridging operational gaps, improving compliance, and ensuring safer, more sustainable international mobility.";
  const bottomTitles = Array.isArray(data?.bottomTitles)
    ? [...data.bottomTitles, '', '', ''].slice(0, 3)
    : ["Proven Strategies for Growth", "Expert Insights Into Markets", "Tools for Stability and Resilience"];

  return (
    <section className="relative py-20 bg-zinc-800 flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-40">
        <img
          src={imageSrc}
          alt="Why AEGA Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white/90 mb-8 drop-shadow-lg">WHY AEGA</h2>
        <p className="text-lg md:text-2xl text-white/100 leading-relaxed font-light drop-shadow-md whitespace-pre-line">
          {description}
        </p>
        <div className="pt-6 items-center justify-center flex">
          <a href={"/signup"}>
            <button className="bg-[#F58A07] hover:bg-[#d67806] text-white text-[13px] font-bold px-4 py-3 flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 uppercase">
              Join Us Now
              <ArrowDownRight className="w-6 h-6" />
            </button>
          </a>
        </div>

        {/* Three Steps with Check Icons - now directly under button */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-27 mt-20 px-1">
          {bottomTitles.map((title, idx) => (
            title ? (
              <div key={idx} className="flex items-center gap-3">
                <Check size={28} className="text-white" />
                <span className="text-white/80 font-bold text-lg md:text-xs uppercase">{title}</span>
              </div>
            ) : null
          ))}
        </div>
      </div>
    </section>
  );
};