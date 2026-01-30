import Image from "next/image";
import bgImage from "../../../public/about-bg.png"; // your diagonal gradient background

export default function AboutHero() {
  return (
    <section className="relative w-full h- overflow-hidden bg-[#0A1628]">
      {/* Background Image - Diagonal Gradient */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="AEGA background"
          fill
          priority
          className="object-cover object-center"
          quality={100}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:px-12 lg:py-40">
        {/* Breadcrumb / Section Label */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-white/60">
            ABOUT US
          </p>
        </div>

        {/* Main Heading */}
        <div className="max-w-3xl">
          <h1 className="mb-8 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            ELEVATING INTEGRITY IN
            <br />
            INTERNATIONAL
            <br />
            RECRUITMENT
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            AEGA is the first global alliance led by UKVi and higher-education
            experts to professionalize international recruitment through
            independent guidance, operational oversight, and innovative
            technology to ensure ethical integrity and student success.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Stat 1 */}
          <div className="border-l-2 border-white/20 pl-6">
            <p className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              500+
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
              Successful consultations
            </p>
          </div>

          {/* Stat 2 */}
          <div className="border-l-2 border-white/20 pl-6">
            <p className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              200+
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
              Hours of expert-led investment
            </p>
          </div>

          {/* Stat 3 */}
          <div className="border-l-2 border-white/20 pl-6">
            <p className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              100+
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
              Publications on investment
            </p>
          </div>

          {/* Stat 4 */}
          <div className="border-l-2 border-white/20 pl-6">
            <p className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              3K+
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
              Satisfied clients
            </p>
          </div>
        </div>
      </div>

      {/* Optional: Dark overlay for better text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A1628]/40 via-transparent to-[#0A1628]/60" />
    </section>
  );
}
