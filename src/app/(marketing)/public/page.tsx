import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Testimonial from "@/components/university/testimonials";

export default function ForThePublicPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050B1F]">
      {/* Background Image - Top Right Gradient */}
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        {/* Hero Section */}
        <div className="mb-20">
          <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/60">
            FOR THE PUBLIC
          </p>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            FOR THE PUBLIC
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            Information and resources for students, parents, and the general public
          </p>
        </div>

        {/* Main Content Section */}
        <div className="mb-20 flex flex-col items-center gap-16 lg:flex-row">
          {/* Left: Presentation Image */}
          <div className="w-full max-w-md lg:w-auto">
            <div className="relative h-[480px] w-full overflow-hidden shadow-2xl lg:w-[360px]">
              <Image
                src="/presentation.jpg"
                alt="Presentation"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 space-y-12">
            {/* What AEGA Does */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                WHAT AEGA DOES?
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/70 md:text-base">
                The Agents & Educators Global Alliance (AEGA) is a pioneering independent
                association and regulatory alliance designed to professionalize the international
                student recruitment sector. It serves as a "strategic and operational backbone" for
                both student agents and educational Sponsors (universities) by bridging the gaps
                left by traditional organizations.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58A07]" />
                  <span className="text-sm text-white/70">Agent certification and verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58A07]" />
                  <span className="text-sm text-white/70">Continuous compliance monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58A07]" />
                  <span className="text-sm text-white/70">Student protection mechanisms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58A07]" />
                  <span className="text-sm text-white/70">Complaint investigation and resolution</span>
                </li>
              </ul>
            </div>

            {/* Making a Complaint */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                MAKING A COMPLAINT
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/70 md:text-base">
                If you have concerns about an education agent's conduct, we take all complaints
                seriously and investigate thoroughly.\
              </p>
              <Link
                href="/submit-complaint"
                className="inline-flex items-center gap-2 bg-[#F58A07] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#e07b06]"
              >
                SUBMIT A COMPLAINT
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <Testimonial />
      </div>
    </div>
  );
}
