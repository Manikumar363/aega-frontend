import React from 'react';

const COURSES = [
  {
    title: "Compliance & UKVI Masterclass",
    desc: "Gain clarity on UKVI expectations, risk indicators, right-to-study checks, and compliant recruitment practices for agents and Sponsors.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Pre-CAS Interview Training",
    desc: "Learn how to conduct high-quality Pre-CAS interviews. Identify risk profiles, and prepare students for successful CAS issuance.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Admission & Document Verification Training",
    desc: "Understand standards, prevent fraud, track timelines, and optimize admissions workflows.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "AI & Technology in Recruitment",
    desc: "Discover how AI tools, compliance platforms, and automation can strengthen student screening, workflow efficiency, and reporting.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"
  },
];

const WIDE_COURSES = [
  {
    title: "Ethical Recruitment & Student Welfare",
    desc: "Build best practices for safeguarding, duty of care, student expectations, and ethical communication.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
  },
  {
    title: "Market Intelligence & Recruitment Strategy",
    desc: "Develop data-driven approaches for key regions — South Asia, Africa, LATAM, and the Middle East.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop"
  }
];

export const TrainingGrid = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-black mb-4">Explore with us</h2>
        <div className="w-full h-px bg-gray-200 mb-12"></div>

        {/* Row 1: 4 Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {COURSES.map((course, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900 mb-3">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{course.desc}</p>
                <button className="w-full bg-orange-400 text-white font-bold py-2 rounded hover:bg-orange-500 transition-colors text-sm">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: 2 Wide Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {WIDE_COURSES.map((course, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-56 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-bold text-xl text-slate-900 mb-3">{course.title}</h3>
                <p className="text-gray-500 mb-6 flex-grow">{course.desc}</p>
                <button className="w-full bg-orange-400 text-white font-bold py-3 rounded hover:bg-orange-500 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};