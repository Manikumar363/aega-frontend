import Image from "next/image";

export default function NewsHero() {
  return (
    <section className="relative w-full bg-[#03091F] py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              NEWS & EVENTS
            </h1>
          </div>

          {/* Right Diagonal Orange Shape */}
          <div className="pointer-events-none absolute right-0 top-0 h-auto w-auto">
                  <Image
                    src="/members-design.png"
                    alt="Background"
                    width={900}
                    height={600}
                    className="h-auto w-auto object-contain opacity-80"
                    priority
                  />
        </div>
        </div>
      </div>

      {/* Mobile Orange Accent */}
      <div className="md:hidden absolute bottom-0 right-0 w-48 h-48 bg-linear-to-t from-[#F68E2D] to-[#D97B3C] opacity-30 rounded-full blur-3xl"></div>
    </section>
  );
}
