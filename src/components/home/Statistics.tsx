export default function OurCoreValues() {
  const VALUES = [
    {
      number: "01.",
      title: "INTEGRITY FIRST",
      description:
        "We prioritize transparency and non-negotiable ethical standards in every partner and student interaction.",
    },
    {
      number: "02.",
      title: "ACCOUNTABILITY YOU CAN TRUST",
      description:
        "Our business approach is measurable, auditable, and strictly aligned with global regulatory expectations.",
    },
    {
      number: "03.",
      title: "COLLABORATION FOR PROGRESS:",
      description:
        "We unite agents, universities, and regulators to solve global recruitment challenges through shared standards.",
    },
    {
      number: "04.",
      title: "INTEGRITY FIRST",
      description:
        "We prioritize transparency and non-negotiable ethical standards in every partner and student interaction.",
    },
    {
      number: "05.",
      title: "ACCOUNTABILITY YOU CAN TRUST",
      description:
        "Our business approach is measurable, auditable, and strictly aligned with global regulatory expectations.",
    },
    {
      number: "06.",
      title: "COLLABORATION FOR PROGRESS:",
      description:
        "We unite agents, universities, and regulators to solve global recruitment challenges through shared standards.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#0A1628] py-16">
      {/* Diagonal Orange Corner - Top Left */}
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 bg-gradient-to-br from-[#8B5A3C] to-transparent opacity-70" />

      {/* Diagonal Orange Corner - Bottom Right */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 bg-gradient-to-tl from-[#8B5A3C] to-transparent opacity-70" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* Heading */}
        <h2 className="mb-12 text-center text-4xl font-bold text-white md:text-5xl">
          WHAT WE DO ?
        </h2>

        {/* Values Grid - 3 columns, 2 rows */}
        <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-3">
          {VALUES.map((value, index) => (
            <div
              key={index}
              className="space-y-3 bg-[#0A1628] p-6 md:p-8"
            >
              {/* Title */}
              <h3 className="text-sm font-bold uppercase tracking-wide text-white md:text-base">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-white/70 md:text-sm">
                {value.description}
              </p>

              {/* Number */}
              <p className="text-3xl font-bold text-[#F58A07] md:text-4xl">
                {value.number}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
