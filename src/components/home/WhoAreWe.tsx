import { ArrowDownRight } from 'lucide-react';
import Image from 'next/image';

interface WhoAreWeProps {
  data?: {
    image?: string;
    heading?: string;
    description?: string;
  };
}

export default function WhoAreWe({ data }: WhoAreWeProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/peter-speech.png");

  const heading = data?.heading || "WHO ARE WE ?";
  const description = data?.description || "The Agents & Educators Global Alliance (AEGA) was created to close the widening gap between student recruitment agents and educational Sponsors. With over a decade of sector expertise—including award-winning UKVI compliance leadership AEGA provides a unified framework for agents and institutions to operate ethically, efficiently, and with confidence. We ensure high standards, safer student outcomes, and a trusted pathway for international education.";

  return (
    <section className="relative w-full min-h-screen bg-[#03091F] overflow-hidden flex items-center justify-center py-12 md:py-24">
      {/* Background Geometric Design */}
      <div className="absolute left-5 right-5 top-0 w-1/2 h-full opacity-80">
        <Image
          src="/ourVision-design.png"
          alt="Background design"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-10 gap-8 md:gap-16">
        {/* Left: Photo with label */}
        <div className="flex flex-col items-center md:items-start w-full md:w-5/12 pt-8">
          <span
            className="text-white font-semibold ml-8 text-sm -mt-6 md:text-base mb-6 md:mb-13"
            style={{ letterSpacing: '0.08em' }}
          >
            STORY OF US
          </span>
          <div className="relative ml-5 -mt-10 w-full max-w-sm aspect-3/4 shadow-2xl overflow-hidden">
            <img
              src={imageSrc}
              alt="peter speech"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right: Vision Text */}
        <div className="flex flex-col justify-center w-full md:w-7/12 text-left md:pl-8">
          <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl mb-6 uppercase leading-tight">{heading}</h2>
          <p className="text-white text-base md:text-lg font-normal leading-relaxed whitespace-pre-line">
            {description}
          </p>
          <div className="pt-4">
            <a href={"/about"}>
              <button className="bg-[#F58A07] hover:bg-[#d67806] text-white text-[13px] font-bold px-8 py-3.5 flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20">
                READ MORE
                <ArrowDownRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}