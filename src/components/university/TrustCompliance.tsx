interface TrustComplianceProps {
  data?: {
    title?: string;
    description?: string;
    image?: string;
    points?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export default function TrustCompliance({ data }: TrustComplianceProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/landingPage/why-aega.png");
  const sectionTitle = data?.title || "OUR IMPACT";
  const description = data?.description || "AT AEGA, WE BELIEVE THAT INTERNATIONAL STUDENT RECRUITMENT IS NOT MERELY A TRANSACTION—IT IS A LIFE-CHANGING JOURNEY THAT DEMANDS THE HIGHEST STANDARDS OF PROTECTION AND ETHICS. OUR IMPACT IS MEASURED BY THE STABILITY WE BRING TO INSTITUTIONS AND THE FUTURES WE SECURE FOR STUDENTS WORLDWIDE.";

  const IMPACT = Array.isArray(data?.points) && data.points.length > 0 ? data.points : [
    { title: "UKVI ALIGNED", description: "" },
    { title: "AQF FRAMEWORK", description: "" },
    { title: "GLOBAL STANDARDS", description: "" },
    { title: "EDUCATION AGENCIES", description: "" },
    { title: "HIGHER EDUCATION", description: "" },
    { title: "INTERNATIONAL COMPLIANCE", description: "" },
  ];

  return (
    <section className="w-full bg-[#0A1628] py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* Section Heading and Content Row - Centered */}
        <div className="w-full flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight uppercase mb-4">
            {sectionTitle}
          </h2>
          <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        {/* Banner Image */}
        <div className="relative mb-16 overflow-hidden shadow-2xl aspect-[21/9] md:aspect-[21/7] rounded-2xl border border-white/10 group">
          <img
            src={imageSrc}
            alt={sectionTitle}
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-40"></div>
        </div>

        {/* 6 Column Grid of Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 overflow-hidden rounded-lg">
          {IMPACT.map((impact, index) => (
            <div
              key={index}
              className="flex items-center justify-center text-center p-8 border-b border-white/10 md:border-r border-white/10 last:border-b-0 md:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(n+4)]:border-b-0 min-h-[100px] hover:bg-white/[0.02] transition-all duration-300"
            >
              <h3 className="text-white font-semibold text-sm md:text-base tracking-wider uppercase">
                {impact.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
