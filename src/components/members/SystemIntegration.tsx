interface SystemIntegrationProps {
  data?: {
    image?: string;
    title?: string;
    points?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export default function SystemIntegration({ data }: SystemIntegrationProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/benefits.png");
  const title = data?.title || "OPERATIONAL\nFRAMEWORKS &\nSYSTEMS INTEGRATION";
  
  const SYSTEM_ITEMS = Array.isArray(data?.points) && data.points.length > 0 ? data.points : [
    {
      title: "Whole Business Health Checks",
      description: "A comprehensive 360-degree assessment to identify process breaks, operational gaps, and recommended enhancements for sustainable growth.",
    },
    {
      title: "Lean Working & Systems Integration",
      description: "Guidance on integrating technology-driven features—including tailor-made CRMs and workflow automation—to reduce manual error and increase oversight.",
    },
    {
      title: "Organizational Restructuring",
      description: "Workshop support for mapping the student journey with a new organizational shape that clarifies roles, responsibilities, and leadership dynamics.",
    },
  ];

  return (
    <section className="relative w-full min-h-[600px] bg-[#03091F] overflow-hidden flex items-center justify-center py-12 md:py-24">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-10 gap-10 md:gap-20">
        {/* Left: Content */}
        <div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
          <h2 className="text-white font-bold text-4xl md:text-3xl lg:text-4xl mb-10 leading-tight whitespace-pre-line uppercase">
            {title}
          </h2>
          <div className="flex flex-col gap-10">
            {SYSTEM_ITEMS.map((item, idx) => (
              <div key={idx}>
                <div className="text-white text-lg md:text-lg font-bold mb-2">{item.title}</div>
                <div className="text-white/80 text-base md:text-md font-normal leading-relaxed">{item.description}</div>
                <div className="w-full h-px bg-white/20 mt-11" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Photo with orange corners */}
        <div className="relative w-full md:w-1/2 max-w-md shrink-0 flex flex-col items-center md:items-start">
          <div className="relative w-full aspect-[2/3] max-w-md shadow-2xl overflow-hidden rounded-lg">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover object-center rounded-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
