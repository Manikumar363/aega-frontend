import Image from "next/image";

interface CommitmentProps {
  data?: {
    title?: string;
    description?: string;
    image?: string;
    kpis?: number[];
    points?: Array<{ title: string; description: string; numbering: number }>;
  };
}

export default function Commitment({ data }: CommitmentProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/landingPage/peter-podcast.png");

  const title = data?.title || "OUR COMMITMENT";
  const description = data?.description || "AEGA is the premier global alliance for the student recruitment sector, bridging operational gaps, strengthening compliance, and ensuring safer, more sustainable international mobility.";
  const kpiValues = Array.isArray(data?.kpis) ? data.kpis : [500, 200, 100, 3000];
  const points = Array.isArray(data?.points) ? data.points : [
    { title: "Integrity", description: "Transparent, ethical practice in every decision.", numbering: 1 },
    { title: "Collaboration", description: "Building trusted partnerships across the globe.", numbering: 2 },
    { title: "Innovation", description: "Technology-led solutions for modern recruitment challenges.", numbering: 3 },
    { title: "Excellence", description: "High standards in every policy, process, and service.", numbering: 4 },
    { title: "Responsibility", description: "A duty of care to agents, institutions, and students.", numbering: 5 },
  ];

  const labels = [
    "Successful Consultations",
    "Hours of Expert-Led Training",
    "Publications on Investment",
    "Satisfied Clients"
  ];

  return (
    <section className="relative w-full bg-[#03091F] overflow-hidden py-16 px-2 md:px-0">
      {/* Diagonal Orange Background */}
      <div className="absolute right-0 -top-13 w-[70vw] h-[70vw] max-w-5xl max-h-[800px] z-0" style={{ clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)' }}>
        <Image
          src="/commitment-design.png"
          alt="Diagonal Orange Background"
          fill
          className="object-cover object-top-right"
          priority
        />
      </div>

      {/* Stats Row */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-0 max-w-5xl mx-auto mb-16 bg-[#03091F]/30 backdrop-blur-sm rounded-lg border border-white/5">
        {kpiValues.slice(0, 4).map((value, i) => (
          <div
            key={i}
            className={`flex-1 flex flex-col items-center justify-center py-8 px-2 md:px-0 text-white`}
          >
            <span className="text-4xl md:text-5xl font-bold mb-1">{value}{i === 3 ? "K+" : "+"}</span>
            <span className="text-xs md:text-sm text-center font-normal opacity-85 uppercase tracking-wider px-2">{labels[i] || "Metric"}</span>
          </div>
        ))}
      </div>

      {/* Commitment Section */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Commitments List */}
        <div className="flex flex-col gap-0 w-full text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 uppercase tracking-wide">{title}</h2>

          <div className="flex flex-col divide-y divide-white/20">
            {points.map((item, idx) => (
              <div key={idx} className="py-4 flex flex-col">
                <span className="text-white font-bold text-lg mb-1">
                  <span className="text-[#F58A07] mr-2">{String(item.numbering || idx + 1).padStart(2, '0')}.</span> {item.title}
                </span>
                <span className="text-white/85 text-base font-light">{item.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image and Description box */}
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <div className="relative w-full max-w-[480px] shadow-2xl overflow-hidden bg-[#0A1628] border border-white/5 rounded-lg">
            <div className="relative w-full aspect-[5/4]">
              <img
                src={imageSrc}
                alt="Commitment Visual"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="bg-[#03091F]/90 p-6 flex flex-col gap-4 text-left border-t border-white/5">
              <p className="text-white/80 text-sm font-light leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
