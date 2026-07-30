// src/app/university/terms-of-use/page.tsx
"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect } from "react";

export default function UniversityTermsOfUsePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${base.replace(/\/$/, '')}/api/terms-cms`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const displayData = data || {
    title: 'Terms of Use',
    lastUpdated: 'July 30, 2026',
    introduction: 'By accessing or using our platform, you agree to comply with and be bound by these Terms of Use.',
    sections: [
      { title: '1. User Obligations', content: 'You must provide accurate credentials and supporting documents during registration.' },
      { title: '2. Prohibited Conduct', content: 'You agree not to bypass verification checks, submit false data, or misuse the CDP training resources.' },
      { title: '3. Termination', content: 'We reserve the right to suspend accounts failing compliance monitoring audits.' }
    ]
  };

  return (
    <DashboardLayout role="university">
      <div className="mx-auto max-w-4xl px-4 py-8 text-white text-left">
        <div className="border-b border-white/10 pb-6 mb-8">
          <p className="text-[#F58A07] text-xs font-semibold uppercase tracking-widest mb-2">Legal Documentation</p>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase mb-2">{displayData.title}</h1>
          <p className="text-white/40 text-xs font-medium">Last Updated: {displayData.lastUpdated}</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-white/60">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>Loading document...</span>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-white/80 text-base leading-relaxed whitespace-pre-line">
              {displayData.introduction}
            </p>

            <div className="space-y-6">
              {displayData.sections.map((section: any, idx: number) => (
                <div key={idx} className="bg-[#14112E]/40 border border-white/5 rounded-xl p-6 space-y-3">
                  <h2 className="text-lg font-bold text-white tracking-wide">{section.title}</h2>
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
