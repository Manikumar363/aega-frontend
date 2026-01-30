import { ArrowDownRight } from 'lucide-react';
import Image from 'next/image';

export default function WhoAreWe() {
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
                style={{letterSpacing: '0.08em'}}
              >
                STORY OF US
              </span>
              <div className="relative ml-5 -mt-10 w-full max-w-xs aspect-3/4 shadow-2xl overflow-hidden">
                <Image
                  src="/our-vision.png"
                  alt="Story of Us Photo"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
    
            {/* Right: Vision Text */}
            <div className="flex flex-col justify-center w-full md:w-7/12 text-left md:pl-8">
              <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">WHO ARE WE ?</h2>
              <p className="text-white text-base md:text-lg font-normal leading-relaxed">
               The Agents & Educators Global Alliance (AEGA) was created to close the widening gap between student recruitment agents and educational Sponsors. With over a decade of sector expertise—including award-winning UKVI compliance leadership <br/>
               AEGA provides a unified framework for agents and institutions to operate ethically, efficiently, and with confidence.
               We ensure high standards, safer student outcomes, and a trusted pathway for international education.
              </p>
              <div className="pt-4">
            <button className="bg-[#F58A07] hover:bg-[#d67806] text-white text-[13px] font-bold px-8 py-3.5 flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20">
              READ MORE
              <ArrowDownRight className="w-4 h-4" />
            </button>
          </div>
            </div>
          </div>
        </section>
  );
}