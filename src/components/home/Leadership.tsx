interface TestimonialItem {
  review: string;
  image?: string;
  userDetails: string;
}

interface LeadershipProps {
  data?: TestimonialItem[];
}

export default function Leadership1({ data }: LeadershipProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const testimonials = Array.isArray(data) && data.length > 0 ? data : [
    {
      review: "Peter Yetton’s guidance has been invaluable in strengthening our international recruitment and compliance operations. His collaborative approach helped us apply the principles of “safe growth,” improve audit readiness, enhance transparency, and build stronger agent relationships enabling us to confidently sustain recruitment even in higher-risk markets.",
      userDetails: "Director of UKVI Compliance, University of London",
      image: "/University_of_London.png"
    },
    {
      review: "Pete’s guidance was instrumental in helping our team achieve confident compliance and deliver a very positive audit outcome. Through clear strategic direction, thorough process reviews, and practical support, he strengthened our operations and upskilled our wider institution enabling a capable, collaborative team and reducing reliance on single points of failure.",
      userDetails: "Director of International Recruitment and Admissions, University of Stirling",
      image: "/University_of_Stirling.png"
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
          {testimonials.map((item, index) => {
            const avatar = formatImage(item.image, "/avatar.jpg");
            return (
              <div key={index} className="flex flex-col justify-between">
                <blockquote className="mb-8 text-left">
                  <p className="text-2xl md:text-3xl lg:text-xl font-bold leading-tight text-white whitespace-pre-line">
                    {item.review}
                  </p>
                </blockquote>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative h-15 w-15 overflow-hidden rounded-full border border-white/40 flex-shrink-0">
                    <img
                      src={avatar}
                      alt={item.userDetails}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-base text-white/60">{item.userDetails}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
