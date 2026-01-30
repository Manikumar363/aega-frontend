import Image from "next/image";

export default function GlobalTestimonial() {
  const LOGOS = [
    { name: "Logoipsum 1", src: "/logo-1.png" },
    { name: "Logoipsum 2", src: "/logo-2.png" },
    { name: "Logoipsum 3", src: "/logo-3.png" },
    { name: "Logoipsum 4", src: "/logo-4.png" },
    { name: "Logoipsum 5", src: "/logo-5.png" },
  ];

  return (
    <section className="w-full bg-[#0A1628] py-16">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* Label */}
        <div className="mb-6 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">
            WHAT OUR CLIENTS SAY
          </span>
        </div>

        {/* Quote */}
        <blockquote className="mb-8 text-center">
          <p className="text-xl font-medium leading-relaxed text-white md:text-2xl lg:text-3xl">
            "Maxwell Harper's insights have transformed my investment approach. His
            strategies helped me grow my portfolio by 30% in six months, and I feel
            confident navigating even volatile markets."
          </p>
        </blockquote>

        {/* Profile */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src="/avatar-sarah.jpg"
              alt="Sarah Thompson"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Sarah Thompson</p>
            <p className="text-xs text-white/60">Senior Investment Advisor</p>
          </div>
        </div>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale md:gap-12">
          {LOGOS.map((logo, index) => (
            <div key={index} className="flex h-8 items-center justify-center md:h-10">
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={40}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
