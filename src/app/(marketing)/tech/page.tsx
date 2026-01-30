import React from 'react';
import { TechHero } from '@/components/tech/TechHero';
import { TechInnovation } from '@/components/tech/TechInnovation';
import { TechInitiatives } from '@/components/tech/TechInitiatives';

export default function TechPage() {
  return (
    <main className="flex flex-col w-full">
      <TechHero />
      <TechInnovation />
      <TechInitiatives />
    </main>
  );
}