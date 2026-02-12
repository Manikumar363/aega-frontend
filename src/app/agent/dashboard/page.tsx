"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";

export default function AgentDashboardPage() {
  const statsData = [
    { icon: <ComplianceIcon />, label: "Compliance Score", value: "95%", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "CDP Hours", value: "85/120", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Active Certification", value: "8", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: "15", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Over All Score", value: "99%", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Risk Level", value: "LOW", color: "#F68E2D" },
  ];

  const courses = [
    {
      title: "UKVI COMPLIANCE UPDATE 2025",
      module: "Module 3",
      hours: "3 hours",
      dueDate: "Due: 2025-01-15",
      status: "On going",
      statusColor: "bg-[#4A90E2]",
    },
    {
      title: "ETHICS & STUDENT PROTECTION",
      module: "Module 1",
      hours: "3 hours",
      dueDate: "Due: 2025-01-15",
      status: "Due",
      statusColor: "bg-[#E03137]",
    },
    {
      title: "RISK MANAGEMENT ESSENTIALS",
      module: "",
      hours: "",
      dueDate: "",
      status: "On going",
      statusColor: "bg-[#4A90E2]",
    },
  ];

  return (
    <DashboardLayout role="agent">
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
                  <p className="text-gray-400 text-sm">{stat.label}</p>
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

        {/* Your Courses */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Your Courses</h2>
          
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-[#14112E] border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {course.title}
                    </h3>
                    {course.module && (
                      <p className="text-gray-400 text-sm mb-3">{course.module}</p>
                    )}
                    <div className="flex items-center gap-6 text-gray-400 text-sm">
                      {course.hours && (
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span>{course.hours}</span>
                        </div>
                      )}
                      {course.dueDate && (
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M5 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M11 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span>{course.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`${course.statusColor} text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2`}
                    >
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}