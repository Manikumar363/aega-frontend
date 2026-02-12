"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";

export default function UniversityCertificationsPage() {
  const certifications = [
    {
      id: 1,
      title: "UKVI COMPLIANCE SPECIALIST",
      issueDate: "2025-01-15",
      validTill: "2029-01-15",
    },
    {
      id: 2,
      title: "STUDENT PROTECTION & ETHICS",
      issueDate: "2025-01-15",
      validTill: "2029-01-15",
    },
    {
      id: 3,
      title: "DATA PRIVACY OFFICER",
      issueDate: "2024-06-01",
      validTill: "2028-06-01",
    },
    {
      id: 4,
      title: "CYBERSECURITY COMPLIANCE",
      issueDate: "2024-06-01",
      validTill: "2028-06-01",
    },
    {
      id: 5,
      title: "QUALITY ASSURANCE MANAGER",
      issueDate: "2023-09-30",
      validTill: "2027-09-30",
    },
    {
      id: 6,
      title: "REGULATORY STANDARDS",
      issueDate: "2023-09-30",
      validTill: "2027-09-30",
    },
    {
      id: 7,
      title: "PROJECT COORDINATOR",
      issueDate: "2023-03-15",
      validTill: "2027-03-15",
    },
    {
      id: 8,
      title: "COMPLIANCE TRAINING",
      issueDate: "2023-03-15",
      validTill: "2027-03-15",
    },
  ];

  return (
    <DashboardLayout role="university">
        <h1 className="text-white font-medium text-3xl mb-6">Certifications</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="bg-[#14112E] border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <svg
                className="w-6 h-6 text-[#F68E2D] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-[#F68E2D]">
                {cert.title}
              </h3>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-white text-sm">
                Issue Date : {cert.issueDate}
              </p>
              <p className="text-white text-sm">
                Valid Till : {cert.validTill}
              </p>
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
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}