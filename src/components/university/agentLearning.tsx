interface AgentLearningProps {
  data?: {
    title?: string;
    description?: string;
    image?: string;
    points?: Array<{
      numbering: string;
      title: string;
      description: string;
    }>;
  };
}

export default function AgentLearning({ data }: AgentLearningProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/peter-founders.png");
  const title = data?.title || "AEGA LEARNING PATH";
  const description = data?.description || "Comprehensive support at every stage of your agent development journey";
  
  const LEARNING_PATHS = Array.isArray(data?.points) && data.points.length > 0 ? data.points : [
    {
      numbering: "01.",
      title: "Onboarding",
      description: "A structured introduction to AEGA's standards, systems, and expectations to get you started on the right foot.",
    },
    {
      numbering: "02.",
      title: "Mandatory Training",
      description: "Complete required modules covering ethics, compliance frameworks, and best practices in international student recruitment.",
    },
    {
      numbering: "03.",
      title: "CPD Tracking",
      description: "Log and monitor your Continuing Professional Development hours to maintain your accreditation and demonstrate growth.",
    },
    {
      numbering: "04.",
      title: "Compliance Scoring",
      description: "Receive a real-time compliance score reflecting your adherence to AEGA's regulatory and ethical standards.",
    },
    {
      numbering: "05.",
      title: "Insurance Support",
      description: "Access guidance and resources on professional indemnity insurance to protect your agency and clients.",
    },
    {
      numbering: "06.",
      title: "Certification",
      description: "Earn AEGA-recognised certifications that validate your expertise and build trust with universities and students.",
    },
    {
      numbering: "07.",
      title: "Ongoing Monitoring",
      description: "Continuous oversight and feedback to ensure sustained compliance, quality practice, and professional development.",
    },
  ];

  return (
    <section className="relative w-full min-h-[600px] bg-[#03091F] overflow-hidden py-12 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-white font-bold text-3xl md:text-5xl uppercase">{title}</h2>
          <p className="text-white/80 mt-3">{description}</p>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full gap-10 md:gap-20">
          {/* Left: Learning Path List */}
          <div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
            <div className="flex flex-col">
              {LEARNING_PATHS.map((item, index) => (
                <div key={index}>
                  <div className="flex items-baseline gap-4 py-4">
                    <span className="text-[#F68E2D] font-bold text-5xl md:text-6xl leading-none shrink-0">
                      {item.numbering || `${String(index + 1).padStart(2, "0")}.`}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#F68E2D] text-lg md:text-xl font-semibold">{item.title}</span>
                      <span className="text-white/70 text-sm md:text-base font-light leading-relaxed">{item.description}</span>
                    </div>
                  </div>
                  <div className="border-b border-[#F68E2D]/30 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo with orange corners */}
          <div className="relative w-full md:w-1/2 max-w-md shrink-0 flex flex-col items-center md:items-start">
            <div className="relative w-full aspect-[2/4] max-w-md shadow-2xl overflow-hidden rounded-lg">
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover object-center rounded-none"
              />
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-[#F68E2D] rotate-45" />
              <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-[#F68E2D] rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
