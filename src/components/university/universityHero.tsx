import Image from "next/image";

interface UniversityHeroProps {
  data?: {
    title?: string;
    description?: string;
  };
}

export default function UniversityHero({ data }: UniversityHeroProps) {
  const title = data?.title || "FOR UNIVERSITIES &\nSPONSORS";
  const description = data?.description || "Partner with AEGA to access verified agents, reduce recruitment risk, and ensure compliance across your international recruitment network";

  return (
    <section className="relative w-full bg-[#03091F] py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="z-10 text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase leading-tight whitespace-pre-line">
              {title}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-lg whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Right Diagonal Orange Shape */}
          <div className="pointer-events-none absolute right-0 top-0 h-auto w-auto">
            <Image
              src="/members-design.png"
              alt="Background"
              width={900}
              height={600}
              className="h-auto w-auto object-contain opacity-80"
              priority
            />
          </div>
        </div>
      </div>

      {/* Mobile Orange Accent */}
      <div className="md:hidden absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-t from-[#F68E2D] to-[#D97B3C] opacity-30 rounded-full blur-3xl"></div>
    </section>
  );
}
