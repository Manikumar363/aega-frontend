import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] flex items-center bg-[#03091F] overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE LAYER */}
      {/* This assumes hero.png acts as the main background visual */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Man.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-80" 
        />
        {/* Dark Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-linear-to-r from-[#03091F]/90 via-[#03091F]/70 to-transparent"></div>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10 container mx-auto px-8 md:px-12 grid grid-cols-12 h-full items-center">
        
        {/* Text Content - Spans 7 columns */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center space-y-6">
          
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] uppercase tracking-wide">
            A Global Alliance <br />
            <span className="text-gray-400">Elevating Standards</span> <br />
            In International <br />
            Student Recruitment
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg font-light tracking-wide">
            AEGA represents the gold standard in international education, uniting agents and educators to foster trust, excellence, and ethical practices globally.
          </p>

          <div className="pt-4">
            <button className="bg-[#F58A07] hover:bg-[#d67806] text-white text-[13px] font-bold px-8 py-3.5 flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20">
              EXPLORE MORE
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side - If you want the Man image floating separately */}
        {/* If 'Man.jpg' is separate from the background, use this block. 
        <div className="hidden lg:block col-span-5 h-full relative">
             <img 
               src="/Man.png" 
               alt="Professional"
               className="absolute bottom-0 right-0 h-[90%] object-contain object-bottom drop-shadow-2xl"
             />
        </div>*/}

      </div>
    </section>
  );
}