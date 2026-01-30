import React from 'react';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactFormSection } from '@/components/contact/ContactFormSection';
import { FAQSection } from '@/components/contact/FAQSection';

export default function ContactPage() {
  return (
    <main className="flex flex-col w-full">
      <ContactHero />
      <ContactFormSection />
      <FAQSection />
    </main>
  );
}