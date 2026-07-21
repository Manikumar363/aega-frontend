import Image from "next/image";

interface OurVisionProps {
  data?: {
    title?: string;
    image?: string;
    description?: string;
  };
}

export default function OurVision({ data }: OurVisionProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/peter-speech.png");
  const title = data?.title || "OUR VISION";
  const description = data?.description || "A global education landscape where every student is served by certified, compliant, and ethical agents; where universities have complete confidence in their recruitment partners; and where transparency and accountability are the industry standard.";

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
            <img
              src={imageSrc}
              alt="Our Vision Photo"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right: Vision Text */}
        <div className="flex flex-col justify-center w-full md:w-7/12 text-left md:pl-8">
          <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl mb-6 uppercase leading-tight">{title}</h2>
          <p className="text-white text-base md:text-lg font-normal leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
