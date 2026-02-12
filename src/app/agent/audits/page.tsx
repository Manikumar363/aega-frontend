"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";

export default function UniversityAuditsPage() {
  const audits = [
    {
      id: 1,
      title: "BUSINESS HEALTH CHECK",
      date: "2025-01-15",
      status: "Passed",
      statusColor: "bg-[#10B981]",
    },
    {
      id: 2,
      title: "COMPLIANCE AUDIT",
      date: "2025-01-15",
      status: "Failed",
      statusColor: "bg-[#E03137]",
    },
    {
      id: 3,
      title: "DOCUMENTATION REVIEW",
      date: "2025-01-15",
      status: "Passed",
      statusColor: "bg-[#10B981]",
    },
    {
      id: 4,
      title: "DESIGN APPROVAL",
      date: "2025-02-10",
      status: "Passed",
      statusColor: "bg-[#10B981]",
    },
  ];

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Add Audit Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-white font-medium text-3xl">Audits</h1>
          <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-8 py-3 rounded-md flex items-center gap-2 font-medium transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Audit
          </button>
        </div>

        {/* Audits List */}
        <div className="space-y-4">
          {audits.map((audit) => (
            <div
              key={audit.id}
              className="bg-[#14112E] border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {audit.title}
                </h3>
                <span
                  className={`${audit.statusColor} text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2`}
                >
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  {audit.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="3"
                    width="12"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M2 6H14" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M5 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Date : {audit.date}</span>
              </div>

              <button className="bg-[#0a0820] hover:bg-[#1a1640] border border-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}