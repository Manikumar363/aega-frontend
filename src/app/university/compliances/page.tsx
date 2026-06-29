"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UniversityCompliancesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    overallScore: 100,
    numberOfAudits: 0,
    activeIssues: 0,
    riskLevel: "LOW"
  });
  const [indicators, setIndicators] = useState<any[]>([]);

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/university/login");
          return;
        }

        // Fetch compliance summary
        const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/compliance-summary`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.success) {
            setSummary(summaryData.data);
          }
        }

        // Fetch compliance status list
        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/compliance-status`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.success) {
            setIndicators(statusData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching compliance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplianceData();
  }, [router]);

  const statsData = [
    { icon: <ComplianceIcon />, label: "Active Issues", value: String(summary.activeIssues), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Overall Score", value: `${summary.overallScore}%`, color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Risk Level", value: summary.riskLevel, color: summary.riskLevel === 'HIGH' ? '#EF4444' : summary.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981' },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'bg-[#10B981]';
      case 'non-compliant':
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#6B7280]'; // gray for pending
    }
  };

  return (
    <DashboardLayout role="university">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-white font-medium text-2xl">Compliance Overview</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-white/60">
            Loading compliance data...
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Risk Indicator */}
            <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Risk Indicator</h2>
              
              <div className="space-y-2">
                {indicators.length === 0 ? (
                  <div className="text-white/60 text-sm">No indicators registered.</div>
                ) : (
                  indicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="bg-[#0a0820] border border-gray-800 rounded-lg p-5 flex items-center justify-between hover:bg-[#1a1640] transition-colors"
                    >
                      <span className="text-white text-base">{indicator.name}</span>
                      <span className={`${getStatusBadgeClass(indicator.status)} text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2`}>
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        {indicator.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}