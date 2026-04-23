"use client";

import React from "react";

type ModuleItem = {
  title: string;
  module: string;
  hours: string;
  due: string;
  status: "On going" | "Completed" | "Due";
};

const modules: ModuleItem[] = [
  { title: "UKVI COMPLIANCE UPDATE 2025", module: "Module 3", hours: "3 hours", due: "2025-01-15", status: "On going" },
  { title: "ETHICS & STUDENT PROTECTION", module: "Module 1", hours: "3 hours", due: "2025-01-15", status: "Completed" },
  { title: "RISK MANAGEMENT ESSENTIALS", module: "Module 4", hours: "3 hours", due: "2025-01-15", status: "On going" },
  { title: "RISK MANAGEMENT ESSENTIALS", module: "Module 4", hours: "3 hours", due: "2025-01-15", status: "On going" },
  { title: "ADVANCED FINANCIAL ANALYSIS", module: "Module 5", hours: "4 hours", due: "2025-02-20", status: "Completed" },
  { title: "STRATEGIC PROJECT PLANNING", module: "Module 6", hours: "5 hours", due: "2025-03-10", status: "On going" },
  { title: "DATA VISUALIZATION TECHNIQUES", module: "Module 7", hours: "3 hours", due: "2025-04-15", status: "On going" },
  { title: "USER EXPERIENCE DESIGN", module: "Module 8", hours: "6 hours", due: "2025-05-05", status: "Completed" },
  { title: "AGILE METHODOLOGIES", module: "Module 9", hours: "4 hours", due: "2025-06-01", status: "Due" },
  { title: "STRATEGIC PROJECT PLANNING", module: "Module 6", hours: "5 hours", due: "2025-03-10", status: "On going" },
  { title: "DIGITAL MARKETING STRATEGIES", module: "Module 10", hours: "4.5 hours", due: "2025-07-20", status: "On going" },
  { title: "CYBERSECURITY ESSENTIALS", module: "Module 11", hours: "6.5 hours", due: "2025-08-15", status: "On going" },
];

const statusClass: Record<ModuleItem["status"], string> = {
  "On going": "bg-sky-100 text-sky-700",
  Completed: "bg-lime-100 text-lime-700",
  Due: "bg-rose-100 text-rose-700",
};

const dotClass: Record<ModuleItem["status"], string> = {
  "On going": "bg-sky-600",
  Completed: "bg-lime-600",
  Due: "bg-rose-600",
};

const CDPTraining: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-[#14112E] rounded-lg p-5 border border-[#2C2A45]">
        <div className="text-white font-semibold text-xl mb-1">CDP PROGRESS</div>
        <div className="text-white/70 text-sm mb-3">Monthly Progress</div>
        <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-[#F68E2D] rounded-full" style={{ width: "75%" }} />
        </div>
        <div className="text-right text-white">15/20</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m, i) => (
          <div key={i} className="bg-[#07123A] border border-[#2C2A45] rounded-lg p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-white font-semibold">{m.title}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${statusClass[m.status]}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${dotClass[m.status]}`} />
                {m.status}
              </span>
            </div>
            <div className="text-white/90 mb-2">{m.module}</div>
            <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
              <span>◷ {m.hours}</span>
              <span>📅 Due: {m.due}</span>
            </div>
            <button className="ml-auto block bg-[#201B48] border border-[#2C2A45] text-white text-xs px-3 py-2 rounded">
              View Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CDPTraining;