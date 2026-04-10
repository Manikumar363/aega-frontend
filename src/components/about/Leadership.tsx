import Image from "next/image";

export default function Leadership() {
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
                  Peter Yetton’s guidance has been invaluable in strengthening our international recruitment and compliance operations. His collaborative approach helped us apply the principles of “safe growth,” improve audit readiness, enhance transparency, and build stronger agent relationships enabling us to confidently sustain recruitment even in higher-risk markets.
              </p>
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="relative h-17 w-17 overflow-hidden rounded-full border border-white/20">
                <Image
                  src="/Birmingham_City_University.jpg"
                  alt="Birmingham_City_University"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-base text-white/60">Director of UKVI Compliance</p>
              </div>
            </div>
          </div>
          {/* Second Review Card */}
          <div>
            <blockquote className="mb-8 text-left">
              <p className="text-2xl md:text-3xl lg:text-xl font-bold leading-tight text-white">
               Pete’s guidance was instrumental in helping our team achieve confident compliance and deliver a very positive audit outcome. Through clear strategic direction, thorough process reviews, and practical support, he strengthened our operations and upskilled our wider institution enabling a capable, collaborative team and reducing reliance on single points of failure.
              </p>
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="relative h-17 w-17 overflow-hidden rounded-full border border-white/20">
                <Image
                  src="/SOAS_Crest.png"
                  alt="SOAS Crest"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-base text-white/60">Director of International Recruitment and Admissions</p>
              </div>
            </div>
          </div>
        </div>


        {/* Logo Strip - Box Layout with Edge Borders 
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
        </div>*/}
      </div>
    </section>
  );
}
