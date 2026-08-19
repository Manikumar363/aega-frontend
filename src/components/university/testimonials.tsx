interface TestimonialsProps {
  data?: Array<{
    image: string;
    clientName: string;
    description: string;
  }>;
}

export default function Testimonials({ data }: TestimonialsProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const reviews = Array.isArray(data) && data.length > 0 ? data : [
    {
      description: "Drawing on deep sector experience and an open, honest communication style, Pete quickly identified core business challenges and delivered clear, tailored recommendations across policy, people, and structure. His pragmatic approach, strong governance insight, and ability to align internal and external stakeholders helped strengthen oversight and drive more effective, joined-up compliance.",
      image: "/Liverpool_School_of_Tropical_Medicine.png",
      clientName: "Academic Registrar and Director of Compliance and Admissions"
    },
    {
      description: "Pete took the time to understand our business and people, ensuring we developed a truly joined-up, end-to-end approach to UKVI compliance. By engaging widely across teams, he identified what needed to change and helped us implement clear, tailored improvements that strengthened our processes, systems, and overall readiness.",
      image: "/Durham_University.png",
      clientName: "Chief Financial Officer/Executive Board member"
    }
  ];

  return (
    <section className="w-full bg-[#0A1628] py-16">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* Small Label */}
        <div className="mb-6 text-center">
          <span className="text-lg md:text-xl tracking-[0.3em] uppercase text-white/70">
            WHAT OUR CLIENTS SAY
          </span>
        </div>

        {/* Reviews Grid - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {reviews.map((item, index) => (
            <div key={index}>
              <blockquote className="mb-8 text-left">
                <p className="text-2xl md:text-3xl lg:text-xl font-bold leading-tight text-white whitespace-pre-line">
                  {item.description}
                </p>
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="relative overflow-hidden rounded border border-white/20 p-1 bg-white flex items-center justify-center shrink-0" style={{ minWidth: '120px', height: '48px' }}>
                  <img
                    src={formatImage(item.image, "/Liverpool_School_of_Tropical_Medicine.png")}
                    alt={item.clientName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm md:text-base text-white/60 leading-snug">{item.clientName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
