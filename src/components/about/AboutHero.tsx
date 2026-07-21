import Image from "next/image";
import bgImage from "../../../public/about-bg.png"; 

interface AboutHeroProps {
  data?: {
    title?: string;
    description?: string;
    kpiValues?: Array<{ value: string; description: string }>;
  };
}

export default function AboutHero({ data }: AboutHeroProps) {
  const title = data?.title || "ELEVATING INTEGRITY IN\nINTERNATIONAL\nRECRUITMENT";
  const description = data?.description || "AEGA is the first global alliance led by UKVi and higher-education experts to professionalize international recruitment through independent guidance, operational oversight, and innovative technology to ensure ethical integrity and student success.";
  
  const kpis = Array.isArray(data?.kpiValues) && data.kpiValues.length > 0 ? data.kpiValues : [
    { value: "500+", description: "Successful consultations" },
    { value: "200+", description: "Hours of expert-led investment" },
    { value: "100+", description: "Publications on investment" },
    { value: "3K+", description: "Satisfied clients" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#0A1628]">
      {/* Background Image - Diagonal Gradient */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="AEGA background"
          fill
          priority
          className="object-cover object-center"
          quality={100}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:px-12 lg:py-40 text-left">
        {/* Breadcrumb / Section Label */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-white/60">
            ABOUT US
          </p>
        </div>

        {/* Main Heading */}
        <div className="max-w-3xl">
          <h1 className="mb-8 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl uppercase whitespace-pre-line">
            {title}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {kpis.slice(0, 4).map((kpi, idx) => (
            <div key={idx} className="border-l-2 border-white/20 pl-6">
              <p className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                {kpi.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
                {kpi.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional: Dark overlay for better text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A1628]/40 via-transparent to-[#0A1628]/60" />
    </section>
  );
}
