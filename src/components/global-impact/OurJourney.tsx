interface OurJourneyProps {
  data?: {
    image?: string;
    timeline?: Array<{ year: string; title: string; description: string }>;
  };
}

export default function OurJourney({ data }: OurJourneyProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/peter-journey.png");
  const TIMELINE = Array.isArray(data?.timeline) && data.timeline.length > 0 ? data.timeline : [
    {
      year: "2020",
      title: "AEGA Founded",
      description: "Launched with 50 founding members",
    },
    {
      year: "2021",
      title: "500 Agents",
      description: "Reached 500 certified agents across 15 countries",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded to 35 countries with university partnerships",
    },
    {
      year: "2023",
      title: "100+ Universities",
      description: "Partnered with over 100 institutions worldwide",
    },
    {
      year: "2024",
      title: "2,500 Agents",
      description: "Certified 2,500+ agents with 50,000+ CPD hours delivered",
    },
  ];

  return (
    <section className="w-full bg-[#03091F] py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left - Image with orange accent */}
          <div className="relative">
            <div className="relative overflow-hidden shadow-2xl rounded-lg">
              <img
                src={imageSrc}
                alt="AEGA Conference"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* Right - Timeline */}
          <div className="space-y-6 text-left">
            <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
              OUR JOURNEY
            </h2>

            <div className="space-y-14">
              {TIMELINE.map((item, index) => (
                <div key={index}>
                  <div className="pl-0 pb-4">
                    <p className="text-lg font-bold text-white">
                      {item.year} 
                      <span className="text-white ml-3">{item.title}</span>
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {item.description}
                    </p>
                  </div>
                  {index !== TIMELINE.length - 1 && (
                    <div className="ml-0 mt-1 border-t border-white/20 w-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
