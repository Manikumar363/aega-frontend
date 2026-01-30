"use client";
import Image from "next/image";

const TAGS = [
  { label: "VISIONARY", position: "top-[25%] left-[5%]" },
  { label: "MENTOR", position: "top-[15%] left-[35%]" },
  { label: "LEADER", position: "top-[12%] right-[12%]" },
  { label: "INNOVATOR", position: "top-[40%] right-[8%]" },
  { label: "EMPOWERER", position: "bottom-[25%] right-[5%]" },
  { label: "INFLUENCER", position: "bottom-[18%] right-[18%]" },
  { label: "STRATEGIST", position: "bottom-[30%] left-[8%]" },
  { label: "ADVISOR", position: "top-[50%] left-[3%]" },
];

export default function AboutIntro() {
  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* Background Image - Full cover */}
      <div className="absolute inset-0">
        <Image
          src="/about-bg-2.png"
          alt="Background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content Container - Compact */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Center Card - Smaller */}
        <div className="relative mx-auto max-w-md">
          {/* White Card */}
          <div className="bg-white px-6 py-6 shadow-2xl">
            {/* Name */}
            <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-[#0A1628] md:text-3xl">
              PETE YETTON
            </h2>

            {/* Quote */}
            <blockquote className="mb-4 text-center text-xs leading-relaxed text-gray-700 md:text-sm">
            &ldquo;True recruitment success is not about taking risks—it&apos;s about
              managing them. In a shifting regulatory world, AEGA turns
              uncertainty into integrity-driven growth.
            </blockquote>

            {/* Portrait Image - Proper aspect ratio */}
            <div className="relative mx-auto  overflow-hidden bg-[#0A1F3D] shadow-lg">
              <div className="relative aspect-[1/1] w-full">
                <Image
                  src="/pete.jpeg"
                  alt="Pete Yetton"
                  fill
                //   className="object-cover object-[center_20%]"
                //   sizes="(max-width: 768px) 90vw, 400px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Floating Tags - Tiny */}
          {TAGS.map((tag, index) => (
            <div
              key={index}
              className={`absolute ${tag.position} animate-float hidden bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#0A1628] shadow-md md:block`}
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {tag.label}
            </div>
          ))}
        </div>

        {/* Bottom Text - Compact */}
        <div className="mt-8 text-center">
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-white/90 md:text-sm">
            Under Pete&apos;s leadership, AEGA has transformed international student
            recruitment through ethical frameworks, compliance excellence, and
            technology-driven transparency.
          </p>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
