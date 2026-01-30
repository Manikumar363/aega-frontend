import React from 'react';
import { ResearchHero } from '@/components/research/ResearchHero';
import { PolicyGrid } from '@/components/research/PolicyGrid';
import { FindMoreSection } from '@/components/research/FindMoreSection';

export default function ResearchPage() {
  return (
    <main className="flex flex-col w-full">
      <ResearchHero />
      <PolicyGrid />
      <FindMoreSection />
    </main>
  );
}