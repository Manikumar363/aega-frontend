"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface EnrolledCourse {
  _id: string;
  status: string;
  dueDate?: string;
  courseId: {
    _id: string;
    courseName: string;
    modules: number;
    timeInHr: number;
  };
}

export default function UniversityDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("University");
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    overallScore: 100,
    numberOfAudits: 0,
    activeIssues: 0,
    riskLevel: "LOW",
    completedCdpHours: 0,
    targetCdpHours: 120
  });
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Please login first");
          router.push("/university/login");
          return;
        }
 
        // 1. Fetch user profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const name = profileData.firstName || profileData.name || "University";
          setUserName(name);
        }
 
        // 2. Fetch compliance and CDP hours summary
        const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/compliance-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.success) {
            setSummary({
              overallScore: summaryData.data.overallScore ?? 100,
              numberOfAudits: summaryData.data.numberOfAudits ?? 0,
              activeIssues: summaryData.data.activeIssues ?? 0,
              riskLevel: summaryData.data.riskLevel ?? "LOW",
              completedCdpHours: summaryData.data.completedCdpHours ?? 0,
              targetCdpHours: summaryData.data.targetCdpHours ?? 120
            });
          }
        }

        // 3. Fetch user enrolled courses
        const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cdp-courses/me/enrolled`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          const list = Array.isArray(coursesData)
            ? coursesData
            : coursesData.data || coursesData.courses || [];
          setEnrolledCourses(list);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchDashboardData();
  }, [router]);

  const statsData = [
    { icon: <ComplianceIcon />, label: "Compliance Score", value: `${summary.overallScore}%`, color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "CDP Hours", value: `${summary.completedCdpHours}/${summary.targetCdpHours}`, color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Active Issues", value: String(summary.activeIssues), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: String(summary.numberOfAudits), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Overall Score", value: `${summary.overallScore}%`, color: "#F68E2D" },
    { 
      icon: <ComplianceIcon />, 
      label: "Risk Level", 
      value: summary.riskLevel, 
      color: summary.riskLevel === 'HIGH' ? '#EF4444' : summary.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981' 
    },
  ];

  return (
    <DashboardLayout role="university">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Hi, {userName}</h1>
          <p className="text-white/80 text-lg">
            Your compliance score is {summary.overallScore >= 85 ? "excellent" : "good"}. Keep up the great work!
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
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68E2D]"></div>
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {enrolledCourses.map((item, index) => {
                const status = (item.status || "on-going").toLowerCase();
                const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
                const statusColor =
                  status === "completed"
                    ? "bg-green-500"
                    : status === "due"
                    ? "bg-[#E03137]"
                    : "bg-[#4A90E2]";

                return (
                  <div
                    key={item._id || index}
                    className="bg-[#14112E] border border-gray-800 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {item.courseId?.courseName || "CDP Course"}
                        </h3>
                        {item.courseId?.modules && (
                          <p className="text-gray-400 text-sm mb-3">Module {item.courseId.modules}</p>
                        )}
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                          {item.courseId?.timeInHr && (
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              <span>{item.courseId.timeInHr} hours</span>
                            </div>
                          )}
                          {item.dueDate && (
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M5 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M11 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span
                          className={`${statusColor} text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2`}
                        >
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-gray-800 p-8 text-center rounded-lg bg-[#14112E]">
              <p className="text-white/60 text-sm">You have not registered for any courses yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}