// src/app/university/dashboard/page.tsx
"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredUserData, getAuthToken } from "@/lib/api";

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getAuthToken();
    const storedUser = getStoredUserData();

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    setUserName(storedUser.universityName || "University");

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch summary
        const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/compliance-indicators/summary`, {
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
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchDashboardData();
  }, [router]);

  const statsData = [
    { icon: <ComplianceIcon />, label: "Compliance Score", value: `${summary.overallScore}%`, color: "#F68E2D", href: "/university/compliances" },
    { icon: <ComplianceIcon />, label: "CDP Hours", value: `${summary.completedCdpHours}/${summary.targetCdpHours}`, color: "#F68E2D", href: "/university/CDP" },
    { icon: <ComplianceIcon />, label: "Active Issues", value: String(summary.activeIssues), color: "#F68E2D", href: "/university/compliances" },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: String(summary.numberOfAudits), color: "#F68E2D", href: "/university/audits" },
    { icon: <ComplianceIcon />, label: "Overall Score", value: `${summary.overallScore}%`, color: "#F68E2D", href: "/university/compliances" },
    { 
      icon: <ComplianceIcon />, 
      label: "Risk Level", 
      value: summary.riskLevel, 
      color: summary.riskLevel === 'HIGH' ? '#EF4444' : summary.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981',
      href: "/university/compliances"
    },
  ];

  const complianceDistribution = [
    { name: "Agent Compliance", score: 92, color: "#10B981" },
    { name: "University Compliance", score: 94, color: "#F59E0B" },
    { name: "UKVI Compliance", score: 88, color: "#3B82F6" },
    { name: "Rules & Regulations", score: 85, color: "#8B5CF6" },
  ];

  const revenueDistribution = [
    { label: "Total Revenue", value: "$45,000", progress: 100, color: "#10B981" },
    { label: "Commission Earned", value: "$22,500", progress: 50, color: "#3B82F6" },
    { label: "Pending Clearance", value: "$9,500", progress: 21, color: "#F59E0B" },
    { label: "Payout Cleared", value: "$13,000", progress: 29, color: "#8B5CF6" },
  ];

  return (
    <DashboardLayout role="university">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Hi, {userName}</h1>
          <p className="text-white/60 text-sm">
            Overview of platform activity, performance, and highlights.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className="bg-[#14112E] border border-gray-800 rounded-lg p-6 flex items-center justify-between hover:border-[#F68E2D]/40 transition-colors"
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
            </Link>
          ))}
        </div>

        {/* Distributions Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliances Distribution */}
          <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">Compliances Distribution</h2>
            <div className="space-y-4">
              {complianceDistribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-350">{item.name}</span>
                    <span className="font-semibold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">Revenue Distribution</h2>
            <div className="space-y-4">
              {revenueDistribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-350">{item.label}</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}