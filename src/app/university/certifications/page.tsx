"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { getMyEnrolledCourses } from "@/lib/api/cdpService";
import type { CdpEnrollment } from "@/lib/api/types";

const getFullImageUrl = (path?: string) => {
  if (!path) return '';
  let cleanPath = path.replace(/(\/)?uploads\/uploads\//g, 'uploads/');
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  const base = process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || 'https://divine-care.ap-south-1.storage.onantryk.com';
  return `${base.replace(/\/$/, '')}/${cleanPath.replace(/^\//, '')}`;
};

export default function UniversityCertificationsPage() {
  const [certifications, setCertifications] = useState<CdpEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertifications() {
      try {
        setLoading(true);
        const data = await getMyEnrolledCourses();
        // Filter for completed courses
        const completed = data.filter((course) => course.status === "completed");
        setCertifications(completed);
      } catch (err) {
        console.error("Failed to load certifications:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadCertifications();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout role="university">
      <h1 className="text-white font-medium text-3xl mb-2">My Certifications</h1>
      <p className="text-white/60 text-sm mb-6">View all of your completed CDP courses and certificates.</p>
      
      {loading ? (
        <div className="flex items-center justify-center py-20 text-white/60">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#F68E2D]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading completed certifications...
        </div>
      ) : certifications.length === 0 ? (
        <div className="bg-[#14112E] border border-gray-800 rounded-lg p-10 text-center text-white/50">
          <svg className="w-12 h-12 mx-auto text-white/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-lg font-semibold text-white mb-1">No Completed Certifications</p>
          <p className="text-sm">Complete your enrolled CDP courses and upload the certificate to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certifications.map((cert) => {
            const courseName = typeof cert.courseId === 'object' && cert.courseId ? cert.courseId.courseName : 'CDP Course';
            return (
              <div
                key={cert._id}
                className="bg-[#14112E] border border-gray-800 rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-[#F68E2D] shrink-0 animate-pulse"
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
                    <h3 className="text-lg font-semibold text-[#F68E2D] line-clamp-2">
                      {courseName}
                    </h3>
                  </div>

                  {cert.notes && (
                    <p className="text-white/70 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {cert.notes}
                    </p>
                  )}

                  <div className="space-y-1.5 mb-6">
                    <p className="text-white/80 text-xs font-medium">
                      Issue Date : <span className="text-white">{formatDate(cert.completionDate)}</span>
                    </p>
                    <p className="text-white/80 text-xs font-medium">
                      Valid Till : <span className="text-white">{formatDate(cert.dueDate)}</span>
                    </p>
                  </div>
                </div>

                {cert.certificateUrl && (
                  <a
                    href={getFullImageUrl(cert.certificateUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center block bg-[#0a0820] hover:bg-[#1a1640] border border-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Download Certificate
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}