"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentCompliancesPage() {
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
          router.push("/login");
          return;
        }

        // 1. Fetch compliance summary
        const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/compliance-indicators/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.success && summaryData.data) {
            setSummary({
              overallScore: summaryData.data.overallScore ?? 100,
              numberOfAudits: summaryData.data.numberOfAudits ?? 0,
              activeIssues: summaryData.data.activeIssues ?? 0,
              riskLevel: summaryData.data.riskLevel || "LOW",
            });
          }
        }

        // 2. Fetch audit checks list to dynamically update indicators
        const checksRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/audits/checks/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (checksRes.ok) {
          const checksData = await checksRes.json();
          if (checksData.success && Array.isArray(checksData.data) && checksData.data.length > 0) {
            const mappedIndicators = checksData.data.map((chk: any) => {
              const issues = chk.answers?.filter((a: any) => a.status === "non-compliant").length ?? 0;
              let status = "Compliant";
              if (issues > 0) status = "Non-Compliant";
              else if (chk.complianceScore < 70) status = "Under Review";

              return {
                name: chk.categoryName || "Compliance Indicator",
                status,
                score: chk.complianceScore ?? 100,
              };
            });
            setIndicators(mappedIndicators);
          } else {
            // Default indicators fallback
            setIndicators([
              { name: "Agent License Verification", status: "Compliant", score: 100 },
              { name: "UKVI Regulations & Student Visa Check", status: "Compliant", score: 95 },
              { name: "University Code of Practice", status: "Under Review", score: 85 },
              { name: "Financial & Tuition Fee Governance", status: "Compliant", score: 90 },
            ]);
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

  const hasScore = summary.numberOfAudits > 0;
  const scoreDisplay = hasScore ? `${summary.overallScore}%` : "N/A";
  const riskDisplay = hasScore ? summary.riskLevel : "N/A";

  const statsData = [
    { icon: <ComplianceIcon />, label: "Active Issues", value: String(summary.activeIssues), color: summary.activeIssues > 0 ? "#EF4444" : "#10B981" },
    { icon: <ComplianceIcon />, label: "Overall Score", value: scoreDisplay, color: "#F68E2D" },
    {
      icon: <ComplianceIcon />,
      label: "Risk Level",
      value: riskDisplay,
      color: riskDisplay === 'HIGH' ? '#EF4444' : riskDisplay === 'MEDIUM' ? '#F59E0B' : riskDisplay === 'LOW' ? '#10B981' : '#9CA3AF'
    },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: String(summary.numberOfAudits), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Categories Audited", value: String(indicators.length), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Compliant Areas", value: String(indicators.filter((i) => i.status === "Compliant").length), color: "#10B981" },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
      case 'passed':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'under review':
      case 'medium':
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'non-compliant':
      case 'failed':
      case 'high':
      case 'action needed':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6 text-white pb-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold">Compliance Overview</h1>
            <p className="text-sm text-white/60">Live status and risk indicators for your agent account.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-white/60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68E2D] mr-3"></div>
            Loading compliance indicators...
          </div>
        ) : (
          <>
            {/* Stats Grid - 2 Rows x 3 Columns */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-800 bg-[#14112E] rounded-xl overflow-hidden shadow-lg">
                {statsData.slice(0, 3).map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 border-b md:border-b-0 md:border-r border-gray-800 last:border-r-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl" style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-semibold">{stat.label}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-800 bg-[#14112E] rounded-xl overflow-hidden shadow-lg">
                {statsData.slice(3, 6).map((stat, index) => (
                  <div
                    key={index + 3}
                    className="flex items-center justify-between p-6 border-b md:border-b-0 md:border-r border-gray-800 last:border-r-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl" style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-semibold">{stat.label}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Indicators */}
            <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Risk Indicators &amp; Category Status</h2>

              <div className="space-y-3">
                {indicators.length === 0 ? (
                  <div className="text-white/60 text-sm py-4 text-center">No compliance indicators found.</div>
                ) : (
                  indicators.map((indicator: any, index: number) => (
                    <div
                      key={index}
                      className="bg-[#0A0724] border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-[#F68E2D]/40 transition-colors"
                    >
                      <span className="text-white font-semibold text-sm">{indicator.name}</span>
                      <span className={`${getStatusBadgeClass(indicator.status)} text-xs px-3.5 py-1 rounded-full font-bold inline-flex items-center gap-2`}>
                        <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
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