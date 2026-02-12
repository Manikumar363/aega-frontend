"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";

export default function AgentCDPPage() {
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
      module: "Module 4",
      hours: "3 hours",
      dueDate: "Due: 2025-01-15",
      status: "On going",
      statusColor: "bg-[#4A90E2]",
    },
    {
      title: "RISK MANAGEMENT ESSENTIALS",
      module: "Module 2",
      hours: "3 hours",
      dueDate: "Due: 2025-01-15",
      status: "On going",
      statusColor: "bg-[#4A90E2]",
    },
  ];

  const progress = {
    current: 15,
    total: 20,
    percentage: (15 / 20) * 100,
  };

  return (
    <DashboardLayout role="agent">
      <div className="space-y-8">
        {/* CDP Progress Section */}
        <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">CDP PROGRESS</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Monthly Progress</span>
              <span className="text-white font-semibold">
                {progress.current}/{progress.total}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#F68E2D] h-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Your Courses Section */}
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
                    <p className="text-gray-400 text-sm mb-3">{course.module}</p>
                    
                    <div className="flex items-center gap-6 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>{course.hours}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M5 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M11 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>{course.dueDate}</span>
                      </div>
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