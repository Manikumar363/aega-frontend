export default function GlobalImpactHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0A1628] py-16 md:py-20">
      {/* Orange Diagonal Background - Top Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-[60%] bg-gradient-to-bl from-[#F58A07] via-[#C86A2A] to-transparent opacity-70" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* Heading */}
        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          GLOBAL IMPACT
        </h1>

        {/* Description */}
        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
          AEGA's influence spans 40+ countries, supporting thousands of agents,
          partnering with leading universities, and protecting hundreds of thousands
          of students worldwide.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white md:text-4xl">500+</p>
            <p className="text-[10px] uppercase tracking-wide text-white/60">
              successful consultations
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white md:text-4xl">200+</p>
            <p className="text-[10px] uppercase tracking-wide text-white/60">
              hours of expert-led investment
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white md:text-4xl">100+</p>
            <p className="text-[10px] uppercase tracking-wide text-white/60">
              publications on investment
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white md:text-4xl">3K+</p>
            <p className="text-[10px] uppercase tracking-wide text-white/60">
              satisfied clients
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
