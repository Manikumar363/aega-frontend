"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";

export default function UniversityDashboardPage() {
  const statsData = [
    { icon: <ComplianceIcon />, label: "Agents", value: "75", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Avg. Compliance", value: "85/120", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Total Students", value: "8", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: "15", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Active Alerts", value: "99%", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Risk Level", value: "LOW", color: "#F68E2D" },
  ];

  const complianceDistribution = [
    {
      label: "Excellent ( 85% - 100% )",
      current: 50,
      total: 75,
      percentage: (50 / 75) * 100,
      color: "#10B981",
    },
    {
      label: "Good ( 50% - 84% )",
      current: 24,
      total: 75,
      percentage: (24 / 75) * 100,
      color: "#3B82F6",
    },
    {
      label: "Poor ( 0% - 49% )",
      current: 1,
      total: 75,
      percentage: (1 / 75) * 100,
      color: "#F68E2D",
    },
  ];

  return (
    <DashboardLayout role="university">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Hi, Jane</h1>
          <p className="text-white/80 text-lg">
            Your compliance score is excellent. Keep up the great work!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-[#14112E] border border-gray-800 rounded-lg p-6 flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-white text-base">{stat.label}</p>
                </div>
              </div>
              <div>
                <p
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Compliances Distribution */}
        <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            AGENT COMPLIANCES DISTRIBUTION
          </h2>

          <div className="space-y-6">
            {complianceDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{item.label}</span>
                  <span className="text-white font-medium">
                    {String(item.current).padStart(2, '0')}/{item.total}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course */}
        <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                UKVI COMPLIANCE UPDATE 2025
              </h3>
              <p className="text-gray-400 text-sm mb-3">Module 3</p>
              
              <div className="flex items-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>3 hours</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Due: 2025-01-15</span>
                </div>
              </div>
            </div>
            
            <div>
              <span className="bg-[#4A90E2] text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                On going
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}