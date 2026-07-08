"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentCompliancesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    overallScore: 100,
    numberOfAudits: 0,
    activeIssues: 0,
    riskLevel: "LOW"
  });
  const [indicators, setIndicators] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/agent/login");
          return;
        }

        // 1. Fetch compliance summary (Overall)
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

        // 2. Fetch compliance status list (Overall)
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

        // 3. Fetch location-based compliance aggregations
        const locRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/compliance-locations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (locRes.ok) {
          const locData = await locRes.json();
          if (locData.success) {
            setLocationData(locData.data || {});
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

  const currentSummary = activeTab === "all" ? summary : (locationData[activeTab]?.summary || {
    overallScore: 100,
    numberOfAudits: 0,
    activeIssues: 0,
    riskLevel: "LOW"
  });

  const currentIndicators = activeTab === "all" ? indicators : (locationData[activeTab]?.indicators || []);

  const statsData = [
    { icon: <ComplianceIcon />, label: "Active Issues", value: String(currentSummary.activeIssues), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Overall Score", value: `${currentSummary.overallScore}%`, color: "#F68E2D" },
    { 
      icon: <ComplianceIcon />, 
      label: "Risk Level", 
      value: currentSummary.riskLevel, 
      color: currentSummary.riskLevel === 'HIGH' ? '#EF4444' : currentSummary.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981' 
    },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: String(currentSummary.numberOfAudits), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Categories Audited", value: String(currentIndicators.filter((i: any) => i.status !== 'Pending').length), color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Compliant Areas", value: String(currentIndicators.filter((i: any) => i.status === 'Compliant').length), color: "#10B981" },
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
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Top Tab */}
        <div className="flex flex-wrap gap-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "all"
                ? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
                : "text-white/60 hover:text-white"
            }`}
          >
            All
          </button>
          {Object.entries(locationData).map(([locName, locObj]: [string, any]) => (
            <button
              key={locName}
              onClick={() => setActiveTab(locName)}
              className={`pb-3 text-sm font-light transition-colors flex items-center gap-1 ${
                activeTab === locName
                  ? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {locName} ({locObj.agentCount}) <ChevronDown size={16}/>
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-white font-medium text-2xl">
            Compliance Overview {activeTab !== "all" && ` - ${activeTab}`}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-white/60">
            Loading compliance data...
          </div>
        ) : (
          <>
            {/* Stats Grid - 2 Rows x 3 Columns */}
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-800 bg-[#14112E]">
                {statsData.slice(0, 3).map((stat, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-6 border-b md:border-b-0 md:border-r border-gray-800 last:border-r-0`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl" style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-white text-sm">{stat.label}</p>
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-800 bg-[#14112E]">
                {statsData.slice(3, 6).map((stat, index) => (
                  <div
                    key={index + 3}
                    className={`flex items-center justify-between p-6 border-b md:border-b-0 md:border-r border-gray-800 last:border-r-0`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl" style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-white text-sm">{stat.label}</p>
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Indicator */}
            <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Risk Indicator</h2>
              
              <div className="space-y-2">
                {currentIndicators.length === 0 ? (
                  <div className="text-white/60 text-sm">No indicators registered.</div>
                ) : (
                  currentIndicators.map((indicator: any, index: number) => (
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