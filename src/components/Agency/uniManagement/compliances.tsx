import { ShieldAlert } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CompliancesProps {
  targetId: string;
  targetType: "agent" | "university" | "company";
}

const Compliances: React.FC<CompliancesProps> = ({ targetId, targetType }) => {
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
      if (!targetId) return;
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        // Fetch compliance summary
        const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/audits/compliances/summary?targetType=${targetType}&targetId=${targetId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.success) {
            setSummary(summaryData.data);
          }
        }

        // Fetch compliance status list
        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/audits/compliances/status?targetType=${targetType}&targetId=${targetId}`, {
          headers: { Authorization: `Bearer ${token}` }
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
  }, [targetId, targetType]);

  const stats = [
    [
      { label: "Active Issue", value: String(summary.activeIssues), valueColor: "#F68E2D" },
      { label: "Over All Score", value: `${summary.overallScore}%`, valueColor: "#F68E2D" },
      { label: "Risk Level", value: summary.riskLevel, valueColor: summary.riskLevel === 'HIGH' ? '#EF4444' : summary.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981' },
    ],
    [
      { label: "No. of Audits", value: String(summary.numberOfAudits), valueColor: "#F68E2D" },
      { label: "Active Alerts", value: String(summary.activeIssues), valueColor: "#F68E2D" },
      { label: "Risk Level", value: summary.riskLevel, valueColor: summary.riskLevel === 'HIGH' ? '#EF4444' : summary.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981' },
    ],
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'border-[#00C48C] text-[#00C48C]';
      case 'non-compliant':
        return 'border-[#EF4444] text-[#EF4444]';
      default:
        return 'border-[#6B7280] text-[#6B7280]'; // gray for pending
    }
  };

  const getStatusBulletClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'bg-[#00C48C]';
      case 'non-compliant':
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#6B7280]';
    }
  };

  if (isLoading) {
    return <div className="text-white/60 text-sm">Loading compliances...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      {stats.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 border border-[#3A3760]">
          {row.map((card, colIdx) => (
            <div
              key={colIdx}
              className={`bg-[#14123A] px-6 py-5 flex flex-col gap-4 ${
                colIdx < row.length - 1 ? "border-r border-[#3A3760]" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <ShieldAlert className="w-5 h-5 text-[#F68E2D]" />
                <span className="font-bold text-base" style={{ color: card.valueColor }}>
                  {card.value}
                </span>
              </div>
              <span className="text-white text-sm">{card.label}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Risk Indicator */}
      <div className="bg-[#14123A] border border-[#3A3760] p-6">
        <h3 className="text-white text-lg font-bold mb-4">Risk Indicator</h3>
        <div className="bg-[#0F0D2B] border border-[#3A3760]">
          {(indicators.length > 0 ? indicators : [
            { name: "Academic Quality & Standards", status: "Compliant" },
            { name: "Financial Audits & Record Compliance", status: "Compliant" },
            { name: "Student Visa Verification Compliance", status: "Compliant" },
            { name: "Data Protection & Privacy (GDPR/FERPA)", status: "Compliant" }
          ]).map((item, idx, array) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-5 py-4 ${
                idx < array.length - 1 ? "border-b border-[#2D2A50]" : ""
              }`}
            >
              <span className="text-white text-sm">{item.name}</span>
              <div className="flex justify-center items-center">
                <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border bg-transparent text-xs font-semibold ${getStatusBadgeClass(item.status || "Compliant")}`}>
                  <span className={`w-2 h-2 rounded-full ${getStatusBulletClass(item.status || "Compliant")}`} />
                  {item.status || "Compliant"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compliances;
