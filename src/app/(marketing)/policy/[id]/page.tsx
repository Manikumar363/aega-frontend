import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy Details",
};

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

const DEFAULT_POLICIES = [
  {
    key: 'privacy',
    title: 'Privacy Policy',
    description: 'Outlines how AEGA collects, utilizes, and secures user data.',
    content: 'AEGA is committed to protecting the privacy of our students, agents, and university partners. This policy details our data collection practices, the security measures we employ, and how you can exercise your privacy rights.'
  },
  {
    key: 'website',
    title: 'Website Policy',
    description: 'Standard usage guidelines for visiting and interacting with the AEGA platform.',
    content: 'By accessing and utilizing the AEGA platform, you consent to comply with our website policies. This includes guidelines on acceptable usage, prohibited behaviors, and intellectual property ownership.'
  },
  {
    key: 'terms',
    title: 'Terms of Use',
    description: 'The legal agreement governing membership, user obligations, and platform usage.',
    content: 'These Terms of Use govern your access to the services, databases, and portal systems provided by AEGA. Users are responsible for maintaining confidentiality of credentials and ensuring lawful compliance.'
  },
  {
    key: 'conduct',
    title: 'Code of Conduct',
    description: 'Ethical standards and compliance metrics required for all AEGA members.',
    content: 'Our Code of Conduct defines the professional integrity, transparency, and ethical recruitment standards expected from all certified educational agents and institutional sponsors.'
  },
  {
    key: 'confidentiality',
    title: 'Confidentiality Policy',
    description: 'Data protection standards for handling sensitive student and corporate data.',
    content: 'Sponsors and agents must handle all student records, personal identifiers, and visa document uploads with absolute confidentiality. Unsanctioned disclosure of user data is strictly prohibited.'
  },
  {
    key: 'gdpr',
    title: 'GDPR Policy',
    description: 'Strict adherence protocols for handling European Union student data.',
    content: 'In compliance with the General Data Protection Regulation (GDPR), AEGA guarantees EU citizens complete transparency, data access rights, and the right to be forgotten. This policy explains our compliance framework.'
  }
];

const parseMarkdown = (markdown: string) => {
  if (!markdown) return '';
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Headers (H3, H2, H1)
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-md font-bold text-white mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-white mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-xl font-bold text-white mt-4 mb-2">$1</h1>');
  // Lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, '<li class="ml-4 list-disc text-white/80">$1</li>');
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-black/40 p-3 rounded-lg my-2 font-mono text-xs text-[#F58A07] overflow-x-auto whitespace-pre">$1</pre>');
  // Line breaks
  html = html.replace(/\n/g, '<br />');

  return html;
};

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contentDoc = await getPolicyContent();
  const policiesList = contentDoc?.policies || DEFAULT_POLICIES;
  
  const policyItem = policiesList.find((p: any) => p.key === id);

  if (!policyItem) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#050B1F] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Policy Not Found</h1>
          <p className="text-white/60">The requested policy details could not be found.</p>
          <Link href="/policy" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#F58A07] hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Policies
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 md:px-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/policy"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Policies
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-left border-b border-white/10 pb-8">
          <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-[#F58A07] font-bold">
            AEGA OFFICIAL POLICY
          </p>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl uppercase leading-tight">
            {policyItem.title}
          </h1>
          <p className="text-sm leading-relaxed text-white/70 md:text-base font-medium">
            {policyItem.description}
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-[#0A1628]/80 border border-white/10 p-8 md:p-10 rounded-lg text-left shadow-2xl backdrop-blur-xs">
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-sm leading-relaxed text-white/80 space-y-2 select-text"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(policyItem.content) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
