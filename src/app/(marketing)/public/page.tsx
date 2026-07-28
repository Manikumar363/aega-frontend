import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Testimonial from "@/components/university/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For the Public",
};

async function getPublicData() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public-cms`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Error fetching public CMS data:', err);
    return null;
  }
}

export default async function ForThePublicPage() {
  const content = await getPublicData();

  const publicHero = content?.publicHero || {
    title: "FOR THE PUBLIC",
    description: "Information and resources for students, parents, and the general public",
  };

  const whatAegaDoes = content?.whatAegaDoes || {
    title: "WHAT AEGA DOES?",
    description: 'The Agents & Educators Global Alliance (AEGA) is a pioneering independent association and regulatory alliance designed to professionalize the international student recruitment sector. It serves as a "strategic and operational backbone" for both student agents and educational Sponsors (universities) by bridging the gaps left by traditional organizations.',
    points: [
      'Agent certification and verification',
      'Continuous compliance monitoring',
      'Student protection mechanisms',
      'Complaint investigation and resolution'
    ],
    title2: 'MAKING A COMPLAINT',
    description2: "If you have concerns about an education agent's conduct, we take all complaints seriously and investigate thoroughly.",
    image: '/peter-speech.png',
  };

  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  const imageSrc = formatImage(whatAegaDoes.image, "/peter-speech.png");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050B1F]">
      {/* Background Image - Top Right Gradient */}
      <div className="pointer-events-none absolute right-0 top-0 h-auto w-auto">
        <img
          src="/members-design.png"
          alt="Background"
          className="h-auto w-auto object-contain opacity-80"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        {/* Hero Section */}
        <div className="mb-20 text-left">
          <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/60">
            FOR THE PUBLIC
          </p>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl uppercase">
            {publicHero.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base whitespace-pre-line">
            {publicHero.description}
          </p>
        </div>

        {/* Main Content Section */}
        <div className="mb-20 flex flex-col items-center gap-16 lg:flex-row">
          {/* Left: Presentation Image */}
          <div className="w-full max-w-md lg:w-auto">
            <div className="relative h-[480px] w-full overflow-hidden shadow-2xl lg:w-[360px] rounded-lg">
              <img
                src={imageSrc}
                alt={whatAegaDoes.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 space-y-12 text-left">
            {/* What AEGA Does */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl uppercase">
                {whatAegaDoes.title}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/70 md:text-base whitespace-pre-line">
                {whatAegaDoes.description}
              </p>
              <ul className="space-y-3">
                {(whatAegaDoes.points || []).map((pt: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58A07]" />
                    <span className="text-sm text-white/70">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Making a Complaint */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl uppercase">
                {whatAegaDoes.title2}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/70 md:text-base whitespace-pre-line">
                {whatAegaDoes.description2}
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
        <Testimonial data={content?.clientReviews} />
      </div>
    </div>
  );
}
