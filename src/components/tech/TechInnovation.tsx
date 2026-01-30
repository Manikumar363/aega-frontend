import React from 'react';

const INNOVATION_POINTS = [
  {
    title: "Improve Compliance & Risk Management",
    desc: "Equip agents and Sponsors with tools for real-time compliance checks, documentation tracking, fraud detection, and performance insights."
  },
  {
    title: "Streamline Recruitment Workflows",
    desc: "Automate key processes such as Pre-CAS interviews, student readiness assessments, communication workflows, and case management."
  },
  {
    title: "Strengthen Global Collaboration",
    desc: "Connect agents, institutions, and sponsors through shared data, reporting tools, and transparent communication channels."
  },
  {
    title: "Promote Ethical & Data-Driven Recruitment",
    desc: "Use analytics and intelligence dashboards to support decision-making, market targeting, and responsible internationalisation."
  }
];

export const TechInnovation = () => {
  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-black mb-4">Driving innovation and collaboration in legal technology</h2>
        <div className="w-full h-px bg-gray-200 mb-12"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left: Image */}
          <div className="relative h-[450px] w-full rounded-lg overflow-hidden shadow-lg">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
               alt="Team Collaboration" 
               className="w-full h-full object-cover"
             />
          </div>

          {/* Right: List */}
          <ul className="space-y-8">
            {INNOVATION_POINTS.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2.5 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-slate-900 inline">{item.title}:</h4>
                  <span className="text-gray-600 ml-1 leading-relaxed text-sm"> {item.desc}</span>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
};