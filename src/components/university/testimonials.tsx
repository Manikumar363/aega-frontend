import Image from "next/image";

export default function Testimonials() {
  const LOGOS = [
    { src: "/logo-1.png" },
    { src: "/logo-5.png" },
    { src: "/logo-4.png" },
    { src: "/logo-4.png" },
    { src: "/logo-5.png" },
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
          {/* First Review Card */}
          <div>
            <blockquote className="mb-8 text-left">
              <p className="text-2xl md:text-3xl lg:text-xl font-bold leading-tight text-white">
                AEGA has completely changed how we approach compliance. The training is practical, clear, and directly aligned with what universities expect. For the first time, we feel confident that our processes are audit‑ready and ethically sound.
              </p>
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/sara.png"
                  alt="Sarah Thompson"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-white">Sarah Thompson</p>
                <p className="text-base text-white/60">Compliance Manager, UniPath</p>
              </div>
            </div>
          </div>
          {/* Second Review Card */}
          <div>
            <blockquote className="mb-8 text-left">
              <p className="text-2xl md:text-3xl lg:text-xl font-bold leading-tight text-white">
                Being part of AEGA has elevated our credibility with university partners. The structured CPD, compliance scoring, and certifications give us a professional standing that sets us compliance scoring apart in a crowded market.
              </p>
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/commitment.jpeg"
                  alt="Phill Evans"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-white">Linh Nguyen</p>
                <p className="text-base text-white/60">Senior Investment Advisor</p>
              </div>
            </div>
          </div>
        </div>


        {/* Logo Strip - Box Layout with Edge Borders */}
        <div className="grid grid-cols-5 w-full border-t border-b border-l border-r border-white/10 mt-8">
          {LOGOS.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-24 border-r border-white/10 last:border-r-0 bg-[#0A1628]"
            >
              <Image
                src={logo.src}
                alt={`Logo ${index + 1}`}
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
