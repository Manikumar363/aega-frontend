interface Leadership1Props {
  data?: Array<{
    image: string;
    clientName: string;
    description: string;
  }>;
}

export default function Leadership1({ data }: Leadership1Props) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const reviews = Array.isArray(data) && data.length > 0 ? data : [
    {
      description: "Peter Yetton’s guidance has been invaluable in strengthening our international recruitment and compliance operations. His collaborative approach helped us apply the principles of “safe growth,” improve audit readiness, enhance transparency, and build stronger agent relationships enabling us to confidently sustain recruitment even in higher-risk markets.",
      image: "/University_of_London.png",
      clientName: "Director of UKVI Compliance"
    },
    {
      description: "Pete’s guidance was instrumental in helping our team achieve confident compliance and deliver a very positive audit outcome. Through clear strategic direction, thorough process reviews, and practical support, he strengthened our operations and upskilled our wider institution enabling a capable, collaborative team and reducing reliance on single points of failure.",
      image: "/University_of_Stirling.png",
      clientName: "Director of International Recruitment and Admissions"
    }
  ];

  return (
    <section className="w-full bg-[#0A1628] py-16">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* Small Label */}
        <div className="mb-6 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/70">
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
                <div className="relative h-15 w-15 overflow-hidden rounded-full border border-white/40">
                  <img
                    src={formatImage(item.image, "/University_of_London.png")}
                    alt={item.clientName}
                    className="w-15 h-15 object-cover rounded-full"
                  />
                </div>
                <div className="text-left">
                  <p className="text-base text-white/60">{item.clientName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
