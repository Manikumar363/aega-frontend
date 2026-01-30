"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  { 
    question: "What is Agents & Educators?", 
    answer: "AEGA is a global alliance that bridges the gap between recruitment agents and educational sponsors, providing compliance support, training, and operational alignment." 
  },
  { 
    question: "How does Agents & Educators work?", 
    answer: "We offer membership-based access to compliance tools, audit readiness support, and a network of verified partners to ensure safe and ethical student recruitment." 
  },
  { 
    question: "What services do they provide?", 
    answer: "Our services include UKVI audit readiness, pre-CAS interviewing, staff training, policy guidance, and strategic partnership development." 
  },
  { 
    question: "What services do they provide?", 
    answer: "Beyond compliance, we offer technology-enabled monitoring, risk intelligence, and growth governance advisory." 
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-start">
        
        {/* Left: Image */}
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg bg-gray-100">
           <img 
             src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
             alt="FAQ Support" 
             className="w-full h-full object-cover"
           />
        </div>

        {/* Right: FAQ Accordion */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Have Questions?</h2>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">We Have Answers!</h2>
          <p className="text-gray-500 mb-10 text-sm">Your trusted resource for membership guidance, compliance queries, operational support, and AEGA services.</p>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center text-left py-2 hover:text-orange-600 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm md:text-base">{faq.question}</span>
                  {openIndex === idx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-500 text-sm leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};