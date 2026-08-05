import { ShieldAlert } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CompliancesProps {
  targetId?: string;
  targetType?: "agent" | "university" | "company";
}

const Compliances: React.FC<CompliancesProps> = ({ targetId, targetType = "agent" }) => {
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
      if (!targetId) {
        setIsLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        // Fetch compliance summary
        const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/audits/compliances/summary?targetType=${targetType}&targetId=${targetId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.success && summaryData.data) {
            setSummary({
              overallScore: summaryData.data.overallScore ?? 100,
              numberOfAudits: summaryData.data.numberOfAudits ?? summaryData.data.numberOfAuditsDone ?? summaryData.data.totalAudits ?? 0,
              activeIssues: summaryData.data.activeIssues ?? summaryData.data.activeAlerts ?? 0,
              riskLevel: summaryData.data.riskLevel || "LOW"
            });
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

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'border-[#00C48C] text-[#00C48C] bg-[#00C48C]/10';
      case 'non-compliant':
        return 'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10';
      default:
        return 'border-[#6B7280] text-[#6B7280] bg-[#6B7280]/10'; // gray for pending/other
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

  const getRiskColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'HIGH':
        return '#EF4444';
      case 'MEDIUM':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  return (
    <div className="space-y-8">
      {/* Agent Compliances Cards */}
      <div>
        <div className="text-white text-2xl font-semibold mb-4">Agent Compliances</div>
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start justify-between min-h-[120px]">
            <span className="text-[#F68E2D] mb-2">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <div className="text-white text-lg font-bold" style={{ color: "#F68E2D" }}>{summary.activeIssues}</div>
              <div className="text-gray-400 text-sm mt-1">Active Issue</div>
            </div>
          </div>
          
          <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start justify-between min-h-[120px]">
            <div className="flex justify-between w-full">
              <span className="text-[#F68E2D]">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <span className="font-bold text-lg" style={{ color: "#F68E2D" }}>{summary.overallScore}%</span>
            </div>
            <div className="text-gray-400 text-sm mt-2">Over All Score</div>
          </div>

          <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start justify-between min-h-[120px]">
            <div className="flex justify-between w-full">
              <span className="text-[#F68E2D]">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <span className="font-bold text-lg" style={{ color: getRiskColor(summary.riskLevel) }}>{summary.riskLevel}</span>
            </div>
            <div className="text-gray-400 text-sm mt-2">Risk Level</div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start justify-between min-h-[120px]">
            <span className="text-[#F68E2D] mb-2">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <div className="text-white text-lg font-bold" style={{ color: "#F68E2D" }}>{summary.numberOfAudits}</div>
              <div className="text-gray-400 text-sm mt-1">No. of Audits</div>
            </div>
          </div>

          <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start justify-between min-h-[120px]">
            <div className="flex justify-between w-full">
              <span className="text-[#F68E2D]">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <span className="font-bold text-lg" style={{ color: "#F68E2D" }}>{summary.activeIssues}</span>
            </div>
            <div className="text-gray-400 text-sm mt-2">Active Alerts</div>
          </div>

          <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start justify-between min-h-[120px]">
            <div className="flex justify-between w-full">
              <span className="text-[#F68E2D]">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <span className="font-bold text-lg" style={{ color: getRiskColor(summary.riskLevel) }}>{summary.riskLevel}</span>
            </div>
            <div className="text-gray-400 text-sm mt-2">Risk Level</div>
          </div>
        </div>
      </div>

      {/* Risk Indicator Table */}
      <div>
        <div className="text-white text-xl font-semibold mb-4">Risk Indicator</div>
        <div className="bg-[#181537] rounded-lg p-6">
          {indicators.length === 0 ? (
            <div className="text-white/60 text-sm">No indicators registered.</div>
          ) : (
            <table className="w-full">
              <tbody>
                {indicators.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#23204a] last:border-b-0">
                    <td className="py-3 text-white">{item.name}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatusBulletClass(item.status)}`}></span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compliances;