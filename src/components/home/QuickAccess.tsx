import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

const UPDATES = [
  {
    category: "Policy Update",
    date: "Dec 12, 2024",
    title: "UKVI announces new financial requirement thresholds for Student Visas",
    excerpt: "The Home Office has released updated guidance regarding maintenance funds for international students effective from..."
  },
  {
    category: "Event",
    date: "Jan 15, 2025",
    title: "Annual AEGA Conference: The Future of Ethical Recruitment",
    excerpt: "Join over 500 delegates in London for our flagship event focusing on compliance technology and..."
  },
  {
    category: "Training",
    date: "Available Now",
    title: "New Module: Fraud Detection in Financial Documents",
    excerpt: "Our latest certification module helps admissions teams spot counterfeit bank statements using..."
  }
];

export const LatestUpdates = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Feed */}
          <div className="lg:col-span-2">
             <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
               Latest Updates <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">3 New</span>
             </h2>
             <div className="space-y-6">
               {UPDATES.map((item, idx) => (
                 <div key={idx} className="flex gap-6 group cursor-pointer border-b border-gray-100 pb-6 last:border-0">
                    <div className="hidden sm:flex flex-col items-center text-center min-w-[80px] pt-1">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                       <Calendar className="w-5 h-5 text-orange-500 mt-2 mb-1" />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 text-xs text-gray-500 mb-1 sm:hidden">
                          <span className="font-bold text-orange-600">{item.category}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                       </div>
                       <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                         {item.title}
                       </h3>
                       <p className="text-gray-600 text-sm leading-relaxed mb-3">
                         {item.excerpt}
                       </p>
                       <span className="text-orange-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                         Read article <ChevronRight className="w-4 h-4" />
                       </span>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Sidebar / CTA */}
          <div className="bg-zinc-900 text-white p-8 rounded-2xl h-fit">
             <h3 className="text-xl font-serif text-orange-500 mb-4">Need Compliance Help?</h3>
             <p className="text-gray-400 text-sm mb-6 leading-relaxed">
               Our expert team is available for one-on-one consultations regarding audit readiness and complex visa cases.
             </p>
             <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors mb-4">
               Book a Consultation
             </button>
             <div className="text-center text-xs text-gray-500">
               Members get 30 mins free consultation
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};