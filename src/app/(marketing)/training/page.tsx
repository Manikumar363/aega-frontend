import React from 'react';
import { TrainingHero } from '@/components/training/TrainingHero';
import { TrainingFilter } from '@/components/training/TrainingFilter';
import { TrainingGrid } from '@/components/training/TrainingGrid';

export default function TrainingPage() {
  return (
    <main className="flex flex-col w-full">
      <TrainingHero />
      <TrainingFilter />
      <TrainingGrid />
    </main>
  );
}