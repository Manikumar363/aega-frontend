import React from 'react';
import { ChevronRight } from 'lucide-react';

const SECTIONS = [
  {
    id: "01",
    title: "Section A : General Provision",
    desc: "Foundational principles that guide ethical, compliant, and student-centred recruitment practices across all AEGA member organisations.",
    points: [
      "Code of Ethical Recruitment",
      "Duty of Care Requirements",
      "Professional Conduct for Agents & Advisors",
      "Student-Centred Service Standards"
    ]
  },
  {
    id: "02",
    title: "Section B: Agent Compliance Requirements",
    desc: "Standards and expectations for maintaining compliant recruitment operations aligned with UKVI and global regulations.",
    points: [
      "Right-to-Study & Documentation Checks",
      "Risk Assessment Procedures",
      "Fraud Prevention Protocols",
      "Record-Keeping & Data Handling Requirements"
    ]
  },
  {
    id: "03",
    title: "Section C: Pre-CAS, Admissions & Student Preparation",
    desc: "Guidance for ensuring students are properly assessed, prepared, and supported prior to CAS issuance or institutional acceptance.",
    points: [
      "Pre-CAS Interview Standards",
      "Document Verification Guidelines",
      "English Language Preparedness Assessments",
      "Student Readiness & Welfare Checks"
    ]
  },
  {
    id: "04",
    title: "Section D: Sponsor & Institution Responsibilities",
    desc: "Expectations for educational Sponsors to ensure safe recruitment processes, robust due-diligence, and aligned operational practices.",
    points: [
      "Admissions Integrity & Timelines",
      "Partnership Oversight & Agent Monitoring",
      "Governance & Risk Management",
      "Compliance Monitoring for Recruitment Teams"
    ]
  },
  {
    id: "05",
    title: "Section E: Partnership, Contracts & Governance",
    desc: "Frameworks to support transparent, accountable, and mutually beneficial relationships between agents and Sponsors.",
    points: [
      "MOU/MOA Best-Practice Standards",
      "Contractual Responsibilities of Agents",
      "Quality Assurance Frameworks",
      "Reporting & Communication Protocols"
    ]
  },
  {
    id: "06",
    title: "Section F: Student Welfare & Post-Arrival Standards",
    desc: "Standards to ensure the continued safety, wellbeing, and engagement of international students once they arrive in the host country.",
    points: [
      "Duty-of-Care Requirements for Agents & Sponsors",
      "Attendance & Engagement Monitoring",
      "Safeguarding & Escalation Procedures",
      "Post-Arrival Orientation & Support Guidelines"
    ]
  }
];

export const RulesContent = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-black mb-12">Table of Contents</h2>
        
        <div className="space-y-8">
          {SECTIONS.map((section, idx) => (
            <div key={idx} className="group border-b border-gray-200 pb-8 hover:bg-gray-50 transition-colors p-4 -mx-4 rounded-lg cursor-pointer">
              <div className="flex gap-6 md:gap-10 items-start">
                
                {/* Number */}
                <span className="text-xl md:text-2xl font-bold text-gray-400 group-hover:text-orange-500 transition-colors">
                  {section.id}.
                </span>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {section.title}
                    </h3>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                    {section.desc}
                  </p>
                  
                  {/* Bullet Points */}
                  <ul className="space-y-2">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-3 text-sm font-medium text-orange-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};