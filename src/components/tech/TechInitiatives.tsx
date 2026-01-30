import React from 'react';

const INITIATIVES = [
  {
    title: "Digital Compliance & Risk Tools",
    desc: "AEGA's digital solutions help agencies and institutions automate compliance processes, track risk indicators, and strengthen decision-making using real-time intelligence.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Workflow Automation for Agency",
    desc: "From enquiry to enrolment, our tools streamline communication, documentation, Pre-CAS preparation, and student case management for greater efficiency and accuracy.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Student Readiness & Orientation Tool",
    desc: "Interactive modules and digital assessments designed to prepare students before departure and support them through post-arrival transitions.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Institution & Sponsor Dashboards",
    desc: "A unified platform enabling Sponsors to view agent performance, track quality metrics, manage partnerships, and monitor compliance across regions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  }
];

export const TechInitiatives = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-black mb-4">Explore Tech Initiatives</h2>
        <div className="w-full h-px bg-gray-200 mb-12"></div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {INITIATIVES.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden flex flex-col">
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900 mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs mb-6 flex-grow leading-relaxed">
                  {item.desc}
                </p>
                <button className="w-full bg-orange-400 text-white font-bold py-2.5 rounded hover:bg-orange-500 transition-colors text-sm">
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