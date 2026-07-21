import Image from "next/image";

interface PreCaseProps {
  data?: {
    title?: string;
    image?: string;
    points?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export default function PreCase({ data }: PreCaseProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/peter-journey.png");
  const title = data?.title || "THE PRE-CAS & STUDENT\nREADINESS PROTOCOL";
  
  const points = Array.isArray(data?.points) && data.points.length > 0 ? data.points : [
    {
      title: "Pre-cas Pre-CAS Interviews:",
      description: "Members must conduct detailed interviews that evaluate a student’s intent, linguistic readiness, and financial stability.",
    },
    {
      title: "Feedback & Clarifications:",
      description: "Every interview requires a standardized feedback loop to provide further guidance to the student or to help the Sponsor make informed CAS decisions.",
    },
    {
      title: "Student Due Diligence:",
      description: "A standardized due diligence overview to verify academic credentials and personal documentation, mirroring the rigour of legal frameworks.",
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#03091F] overflow-hidden flex items-center justify-center py-12 md:py-24">
      {/* Background Geometric Design */}
      <div className="absolute left-5 right-5 top-0 w-1/2 h-full opacity-80">
        <Image
          src="/ourVision-design.png"
          alt="Background design"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-10 gap-8 md:gap-16">
        {/* Left: Photo with label */}
        <div className="flex flex-col items-center md:items-start w-full md:w-5/12 pt-8">
          <div className="relative ml-5 -mt-10 w-full max-w-xs aspect-3/4 shadow-2xl overflow-hidden rounded-lg">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right: Vision Text */}
        <div className="flex flex-col justify-center w-full md:w-7/12 text-left md:pl-8">
          <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl mb-8 whitespace-pre-line uppercase leading-tight">
            {title}
          </h2>
          <div className="flex flex-col gap-8">
            {points.map((item, idx) => (
              <div key={idx}>
                <h3 className="text-white text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 text-base md:text-lg font-normal leading-relaxed">
                  {item.description}
                </p>
                <div className="w-full h-px bg-white/30 mt-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
