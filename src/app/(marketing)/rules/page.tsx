import React from 'react';
import { RulesHero } from '@/components/rules/RulesHero';
import { RulesContent } from '@/components/rules/RulesContent';

export default function RulesPage() {
  return (
    <main className="flex flex-col w-full">
      <RulesHero />
      <RulesContent />
    </main>
  );
}