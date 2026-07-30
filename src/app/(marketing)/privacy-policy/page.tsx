// src/app/(marketing)/privacy-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

async function getPrivacyData() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/privacy-cms`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Error fetching privacy CMS data:', err);
    return null;
  }
}

export default async function PrivacyPolicyPage() {
  const data = await getPrivacyData() || {
    title: 'Privacy Policy',
    lastUpdated: 'July 30, 2026',
    introduction: 'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.',
    sections: [
      { title: '1. Information We Collect', content: 'We collect information you provide directly to us when creating an account, submitting documents, or contacting support.' },
      { title: '2. How We Use Information', content: 'We use the collected information to verify agency/university profiles, manage compliance, and coordinate training.' },
      { title: '3. Data Security', content: 'We implement high-standard technical and organizational measures to safeguard your private credentials.' }
    ]
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050B1F] text-white">
      {/* Decorative background gradients */}
      <div className="pointer-events-none absolute right-0 top-0 h-auto w-auto opacity-50">
        <img
          src="/members-design.png"
          alt="Background"
          className="h-auto w-auto object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 md:px-10">
        {/* Title & Metadata */}
        <div className="border-b border-white/10 pb-8 mb-12 text-left">
          <p className="text-[#F58A07] text-xs font-semibold uppercase tracking-widest mb-3">Legal Documentation</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-4">{data.title}</h1>
          <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Last Updated: {data.lastUpdated}</p>
        </div>

        {/* Intro */}
        <p className="text-white/80 text-lg leading-relaxed mb-12 whitespace-pre-line text-left">
          {data.introduction}
        </p>

        {/* Sections */}
        <div className="space-y-10 text-left">
          {data.sections.map((section: any, idx: number) => (
            <div key={idx} className="bg-[#14112E]/50 border border-white/10 rounded-xl p-6 md:p-8 space-y-4 hover:border-[#F58A07]/30 transition-colors">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">{section.title}</h2>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
