"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();

  const documents = [
    {
      id: 1,
      name: "BUSINESS LICENSE.PDF",
      date: "2024-11-20",
      size: "2.4 MB",
      action: "Download Document",
    },
    {
      id: 2,
      name: "INSURANCE CERTIFICATE.PDF",
      date: "2024-11-20",
      size: "2.4 MB",
      action: "Download Document",
    },
    {
      id: 3,
      name: "COMPLIANCE REPORT.PDF",
      date: "2024-11-15",
      size: "1.2 MB",
      action: "View Proposal",
    },
    {
      id: 4,
      name: "PERSONAL IDENTIFICATION DOC.PDF",
      date: "2024-11-15",
      size: "1.2 MB",
      action: "View Proposal",
    },
  ];

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 border-b border-gray-700">
          <button
            onClick={() => router.push("/agent/profile")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => router.push("/agent/profile")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Edit Profile
          </button>
          <button className="pb-2 text-base font-medium text-[#F68E2D] border-b-2 border-[#F68E2D] transition-colors">
            Documents
          </button>
          <button
            onClick={() => router.push("/agent/profile/reset-password")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Reset Password
          </button>
        </div>

        {/* Upload Document Button */}
        <div className="flex justify-between">
            <h1 className="text-white font-medium text-3xl ">My Documents</h1>
          <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2.5 rounded-md flex items-center gap-2 text-sm transition-colors">
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload Document
          </button>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#14112E] border border-gray-800 rounded-lg p-6"
            >
              {/* Document Header */}
              <div className="flex items-start gap-3 mb-4">
                <svg
                  className="w-6 h-6 text-[#F68E2D] shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-[#F68E2D] text-lg font-medium">
                  {doc.name}
                </h3>
              </div>

              {/* Document Info */}
              <p className="text-white text-sm mb-4">
                {doc.date} • {doc.size}
              </p>

              {/* Action Button */}
              <button className="w-full bg-[#0A0820] hover:bg-[#160F3A] border border-gray-700 text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm transition-colors">
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
                {doc.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
