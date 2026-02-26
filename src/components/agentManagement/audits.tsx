import React from "react";

const auditCards = [
  { title: "BUSINESS HEALTH CHECK", date: "2025-01-15", status: "Passed" },
  { title: "COMPLIANCE AUDIT", date: "2025-01-15", status: "Failed" },
  { title: "DOCUMENTATION REVIEW", date: "2025-01-15", status: "Passed" },
  { title: "DESIGN APPROVAL", date: "2025-02-10", status: "Passed" },
  { title: "USER FEEDBACK SESSION", date: "2025-03-05", status: "Pending" },
  { title: "FINAL IMPLEMENTATION", date: "2025-03-20", status: "Scheduled" },
  { title: "INTERNAL TESTING", date: "2025-04-01", status: "In Progress" },
  { title: "PRODUCT LAUNCH", date: "2025-04-15", status: "Scheduled" },
];

const statusStyles: Record<string, string> = {
  Passed: "bg-green-200 text-green-800",
  Failed: "bg-red-200 text-red-800",
  Pending: "bg-yellow-200 text-yellow-800",
  "In Progress": "bg-blue-200 text-blue-800",
  Scheduled: "bg-green-100 text-green-700",
};

const statusDot: Record<string, string> = {
  Passed: "bg-green-500",
  Failed: "bg-red-500",
  Pending: "bg-yellow-500",
  "In Progress": "bg-blue-500",
  Scheduled: "bg-green-400",
};

const Audits: React.FC = () => (
  <div className="space-y-8">
    {/* Agent Audit Log Cards */}
    <div>
      <div className="text-white text-2xl font-semibold mb-4">Agent Audit Log</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <span className="text-[#F68E2D] mb-2">
            <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
          </span>
          <div className="text-white text-lg font-bold">1</div>
          <div className="text-gray-400 text-sm">Active Issue</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-[#F68E2D] font-bold">99%</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Over All Score</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-yellow-400 font-bold">LOW</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Risk Level</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <span className="text-[#F68E2D] mb-2">
            <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
          </span>
          <div className="text-white text-lg font-bold">15</div>
          <div className="text-gray-400 text-sm">No. of Audits</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-[#F68E2D] font-bold">99%</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Active Alerts</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-yellow-400 font-bold">LOW</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Risk Level</div>
        </div>
      </div>
    </div>

    {/* Audit Log Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {auditCards.map((audit, idx) => (
        <div key={idx} className="bg-[#181537] rounded-lg p-6 flex flex-col gap-2 border border-[#23204a]">
          <div className="flex justify-between items-center">
            <div className="text-white font-semibold">{audit.title}</div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[audit.status]}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${statusDot[audit.status]}`}></span>
              {audit.status}
            </span>
          </div>
          <div className="text-gray-300 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Date : {audit.date}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Audits;