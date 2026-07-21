interface MembershipProps {
  data?: {
    title?: string;
    description?: string;
    image?: string;
    benefits?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export default function Membership({ data }: MembershipProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/aboutPage/peter-meeting.png");
  const title = data?.title || "MEMBERSHIP BENEFITS";
  const description = data?.description || "Build your reputation and grow your business";
  
  const BENEFITS = Array.isArray(data?.benefits) && data.benefits.length > 0 ? data.benefits : [
    {
      title: "Professional Certification Founded",
      description: "Recognized credentials that build trust",
    },
    {
      title: "Compliance Tracking",
      description: "Real-time monitoring and support",
    },
    {
      title: "Business Tools",
      description: "Resources to streamline operations",
    },
    {
      title: "CPD Library",
      description: "Unlimited access to training courses",
    },
    {
      title: "Insurance Support",
      description: "Guidance on professional indemnity",
    },
    {
      title: "Best Practices",
      description: "Learn from industry leaders",
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
          {/* Left: Benefits List */}
          <div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
            <div className="flex flex-col gap-8">
              {BENEFITS.map((item, idx) => (
                <div key={idx}>
                  <div className="text-white text-lg md:text-xl font-bold">{item.title}</div>
                  <div className="text-white/80 text-base md:text-lg font-normal mt-1">{item.description}</div>
                  <div className="w-full h-px bg-white/60 mt-4" />
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
      </div>
    </section>
  );
}
