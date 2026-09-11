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
          <span className="text-lg md:text-xl tracking-[0.3em] uppercase text-white/70">
            WHAT OUR CLIENTS SAY
          </span>
        </div>

        {/* Reviews Grid - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* First Review Card */}
          <div className="flex flex-col justify-between">
            <blockquote className="mb-8 text-left">
              <p className="text-lg md:text-lg lg:text-lg font-medium leading-tight text-white/70 whitespace-pre-line">
                Drawing on deep sector experience and an open, honest communication style, Pete quickly identified core business challenges and delivered clear, tailored recommendations across policy, people, and structure. His pragmatic approach, strong governance insight, and ability to align internal and external stakeholders helped strengthen oversight and drive more effective, joined-up compliance.
              </p>
            </blockquote>
            <div className="flex items-center gap-4 mt-auto">
              <div className="relative h-14 w-14 md:h-16 md:w-16 min-w-[56px] min-h-[56px] md:min-w-[64px] md:min-h-[64px] shrink-0 overflow-hidden rounded-full border border-white/30 bg-[#06101E] flex items-center justify-center p-2 shadow-md">
                <Image
                  src="/university of sydney.png"
                  alt="University of New South Wales"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm md:text-base text-white/60 leading-snug">
                  Academic Registrar and Director of Compliance and Admissions
                </p>
              </div>
            </div>
          </div>

          {/* Second Review Card */}
          <div className="flex flex-col justify-between">
            <blockquote className="mb-8 text-left">
              <p className="text-lg md:text-lg lg:text-lg font-medium leading-tight text-white/70 whitespace-pre-line">
                Pete took the time to understand our business and people, ensuring we developed a truly joined-up, end-to-end approach to UKVI compliance. By engaging widely across teams, he identified what needed to change and helped us implement clear, tailored improvements that strengthened our processes, systems, and overall readiness.
              </p>
            </blockquote>
            <div className="flex items-center gap-4 mt-auto">
              <div className="relative h-14 w-14 md:h-16 md:w-16 min-w-[56px] min-h-[56px] md:min-w-[64px] md:min-h-[64px] shrink-0 overflow-hidden rounded-full border border-white/30 bg-[#06101E] flex items-center justify-center p-2 shadow-md">
                <Image
                  src="/university of birmingham.png"
                  alt="Birmingham City University"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm md:text-base text-white/60 leading-snug">
                  Chief Financial Officer/Executive Board member
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
