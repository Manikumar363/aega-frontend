import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy & Documentation",
};

interface PolicyItem {
  key: string;
  title: string;
  description: string;
  link: string;
}

const DEFAULT_POLICIES = [
  {
    key: 'privacy',
    title: 'Privacy Policy',
    description: 'Outlines how AEGA collects, utilizes, and secures user data.',
    link: '/policy/privacy'
  },
  {
    key: 'website',
    title: 'Website Policy',
    description: 'Standard usage guidelines for visiting and interacting with the AEGA platform.',
    link: '/policy/website'
  },
  {
    key: 'terms',
    title: 'Terms of Use',
    description: 'The legal agreement governing membership, user obligations, and platform usage.',
    link: '/policy/terms'
  },
  {
    key: 'conduct',
    title: 'Code of Conduct',
    description: 'Ethical standards and compliance metrics required for all AEGA members.',
    link: '/policy/conduct'
  },
  {
    key: 'confidentiality',
    title: 'Confidentiality Policy',
    description: 'Data protection standards for handling sensitive student and corporate data.',
    link: '/policy/confidentiality'
  },
  {
    key: 'gdpr',
    title: 'GDPR Policy',
    description: 'Strict adherence protocols for handling European Union student data.',
    link: '/policy/gdpr'
  }
];

async function getPolicyContent() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/policy-cms`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Error fetching policy content:', err);
    return null;
  }
}

export default async function PolicyPage() {
  const contentDoc = await getPolicyContent();
  const policiesList = contentDoc && contentDoc.policies && contentDoc.policies.length > 0
    ? contentDoc.policies.map((item: any) => ({
        key: item.key,
        title: item.title,
        description: item.description,
        link: `/policy/${item.key}`
      }))
    : DEFAULT_POLICIES;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050B1F]">
      {/* Background Image - Top Right Gradient */}
      <div className="pointer-events-none absolute right-0 top-0 h-auto w-auto">
        <Image
          src="/about-bg.png"
          alt="Background"
          width={900}
          height={600}
          className="h-auto w-auto object-contain opacity-80"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        {/* Hero Section */}
        <div className="mb-16 text-left">
          <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/60">
            POLICY
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            POLICY & DOCUMENTATION
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            Access regulatory frameworks, compliance standards, and official documentation.
          </p>
        </div>

        {/* Policies Section */}
        <section className="mb-12 border border-white/20 p-8 md:p-10">
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-wide text-white md:text-3xl text-left">
            STANDARDS & POLICIES
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 text-left">
            {policiesList.map((policy: PolicyItem, index: number) => (
              <div key={index} className="space-y-3 border border-white/10 bg-[#0A1628] p-6 flex flex-col justify-between min-h-[180px]">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase min-h-[40px] flex items-center">
                    {policy.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-white/60">
                    {policy.description}
                  </p>
                </div>
                <Link
                  href={policy.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-[#F58A07] mt-4"
                >
                  LEARN MORE
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
