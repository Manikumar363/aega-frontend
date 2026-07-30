// src/app/university/privacy-policy/page.tsx
"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect } from "react";

export default function UniversityPrivacyPolicyPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${base.replace(/\/$/, '')}/api/privacy-cms`);
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
