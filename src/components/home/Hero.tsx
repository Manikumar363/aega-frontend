import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  data?: {
    image?: string;
    heading?: string;
    description?: string;
    redirectionUrl?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const bgImage = formatImage(data?.image, "/peter.png");
  
  const heading = data?.heading || "A Global Alliance\nElevating Standards\nIn International\nStudent Recruitment";
  const description = data?.description || "AEGA represents the gold standard in international education, uniting agents and educators to foster trust, excellence, and ethical practices globally.";
  const redirect = data?.redirectionUrl || "/about";

  return (
    <section className="relative w-full h-[95vh] flex items-center bg-[#03091F] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover object-[right_13%] opacity-90 scale-100" 
        />
      </div>

      <div className="relative z-10 container mx-auto px-8 md:px-12 grid grid-cols-12 h-full items-center">
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] uppercase tracking-wide whitespace-pre-line">
            {heading}
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg font-light tracking-wide">
            {description}
          </p>

          <div className="pt-4">
            <a 
              href={redirect}
              className="bg-[#F58A07] hover:bg-[#d67806] text-white text-[13px] font-bold px-8 py-3.5 inline-flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 w-fit"
            >
              EXPLORE MORE
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}