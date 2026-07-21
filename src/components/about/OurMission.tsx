interface OurMissionProps {
  data?: {
    image?: string;
    points?: Array<{ title: string; description: string }>;
  };
}

export default function OurMission({ data }: OurMissionProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(data?.image, "/aboutPage/peter-map.png");
  const points = Array.isArray(data?.points) && data.points.length > 0 ? data.points : [
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
        {/* Section Heading */}
        <h2 className="mb-10 text-center text-4xl font-bold text-white md:text-5xl">
          OUR MISSION
        </h2>

        {/* Banner Image */}
        <div className="relative mb-12 overflow-hidden shadow-2xl aspect-[7/2] rounded-lg">
          <img
            src={imageSrc}
            alt="Our Mission"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mission Cards - 3 Column Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {points.map((mission, index) => (
            <div
              key={index}
              className="space-y-4 border-l-2 border-white/20 pl-6 text-left"
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-white md:text-xl">
                {mission.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70 md:text-base">
                {mission.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
