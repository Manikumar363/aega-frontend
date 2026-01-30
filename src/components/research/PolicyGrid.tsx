import React from 'react';

const POLICIES = [
  {
    title: "Sponsor & Visa Compliance (UKVI / Global)",
    desc: "Ensure full compliance with UKVI and global visa-framework requirements. Gain clarity on documentation, monitoring duties, student reporting responsibilities, and compliance risk mitigation.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Rules & Regulations for Agents & Sponsors",
    desc: "Access high-quality, up-to-date policies designed to support ethical, responsible, and compliant international recruitment. Includes agent conduct standards and operational best practices.",
    image: "https://images.unsplash.com/photo-1554224154-260327c00c4c?q=80&w=2069&auto=format&fit=crop"
  },
  {
    title: "Documentation & Audit Support",
    desc: "Comprehensive guidance on compiling and managing compliance-ready documentation. Learn how to prepare for sponsor audits, UKVI reviews, risk assessments, and regulatory evaluations.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2071&auto=format&fit=crop"
  }
];

export const PolicyGrid = () => {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-black mb-4">Policy</h2>
        <div className="w-full h-px bg-gray-200 mb-12"></div>

        <div className="grid md:grid-cols-3 gap-8">
          {POLICIES.map((policy, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
              {/* Card Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={policy.image} 
                  alt={policy.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900 mb-3 min-h-[56px]">
                  {policy.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                  {policy.desc}
                </p>
                <button className="w-full bg-orange-400 text-white font-bold py-3 rounded hover:bg-orange-500 transition-colors text-sm">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};