interface TrustComplianceProps {
  data?: {
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
  const description = data?.description || "AT AEGA, WE BELIEVE THAT INTERNATIONAL STUDENT RECRUITMENT IS NOT MERELY A TRANSACTION—IT IS A LIFE-CHANGING JOURNEY THAT DEMANDS THE HIGHEST STANDARDS OF PROTECTION AND ETHICS. OUR IMPACT IS MEASURED BY THE STABILITY WE BRING TO INSTITUTIONS AND THE FUTURES WE SECURE FOR STUDENTS WORLDWIDE.";
  
  const IMPACT = Array.isArray(data?.points) && data.points.length > 0 ? data.points : [
    {
      title: "ESTABLISH A GLOBAL STANDARD",
      description:
        "We aim to become the world's leading alliance, making AEGA membership the trusted benchmark for recruitment integrity and sponsor compliance.",
    },
    {
      title: "TRANSFORM THE INDUSTRY",
      description:
        "We envision a future where every recruitment agent and educational sponsor operates with the tools and insights necessary for excellence.",
    },
    {
      title: "EMPOWER THROUGH CONFIDENCE",
      description:
        "We strive to equip our partners to facilitate smooth, compliant, and enriching educational experiences for students worldwide.",
    },
  ];

  return (
    <section className="w-full bg-[#0A1628] py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Section Heading and Content Row */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-left text-3xl md:text-2xl font-bold text-white mb-4 md:mb-0 tracking-tight">OUR IMPACT</h2>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <p className="text-white/90 text-lg md:text-xl font-bold leading-snug text-left" style={{lineHeight: '1.3'}}>
              {description}
            </p>
          </div>
        </div>

        {/* Banner Image */}
        <div className="relative mb-12 overflow-hidden shadow-2xl aspect-[7/2] rounded-lg">
          <img
            src={imageSrc}
            alt="Our Impact"
            className="w-full h-full object-cover opacity-100"
          />
        </div>

        {/* Mission Cards - 3 Column Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {IMPACT.map((impact, index) => (
            <div
              key={index}
              className="space-y-4 border-l-2 border-white/20 pl-6 text-left"
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-white md:text-xl">
                {impact.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70 md:text-base">
                {impact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
