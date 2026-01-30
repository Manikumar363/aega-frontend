import React from 'react';

const LIST_ITEMS = [
  {
    title: "Research & Insights",
    desc: "AEGA conducts global research on recruitment integrity, sponsor obligations, UKVI regulations, sector risks, market behaviour, and operational trends."
  },
  {
    title: "Risk Intelligence & Compliance",
    desc: "We analyse compliance challenges, visa-system changes, and international recruitment risks to help members strengthen organisational safety."
  },
  {
    title: "Internationalisation & Global Standards",
    desc: "We support agents and sponsors in understanding global market changes, regulatory updates, and ethical frameworks."
  },
  {
    title: "Ethics & Professional Conduct",
    desc: "AEGA champions high standards of professionalism, transparency, and responsibility. Our research helps members uphold integrity."
  },
  {
    title: "Audit-Ready Frameworks",
    desc: "We develop structured guidelines to help members prepare for UKVI audits, quality checks, and sponsor-related compliance reviews."
  }
];

export const FindMoreSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-black mb-12">Find more about Us</h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Image */}
          <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-lg bg-gray-100">
             <img 
               src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2070&auto=format&fit=crop" 
               alt="Legal Research" 
               className="w-full h-full object-cover"
             />
          </div>

          {/* Right: List */}
          <ul className="space-y-6">
            {LIST_ITEMS.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2.5 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-bold text-slate-900">{item.title}:</span> {item.desc}
                </p>
              </li>
            ))}
          </ul>
          
        </div>
      </div>
    </section>
  );
};