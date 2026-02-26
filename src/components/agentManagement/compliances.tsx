import React from "react";

const riskIndicators = [
  "Documentation",
  "Training Current",
  "Insurance",
  "Financial Health",
  "Basic Compliances Assesment",
  "Visa Refusal Enrollment",
  "Customer Insights",
  "Operational Efficiency",
  "Competitive Analysis",
];

const Compliances: React.FC = () => (
  <div className="space-y-8">
    {/* Agent Compliances Cards */}
    <div>
      <div className="text-white text-2xl font-semibold mb-4">Agent Compliances</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <span className="text-[#F68E2D] mb-2">
            <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
          </span>
          <div className="text-white text-lg font-bold">1</div>
          <div className="text-gray-400 text-sm">Active Issue</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-[#F68E2D] font-bold">99%</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Over All Score</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-yellow-400 font-bold">LOW</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Risk Level</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <span className="text-[#F68E2D] mb-2">
            <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
          </span>
          <div className="text-white text-lg font-bold">15</div>
          <div className="text-gray-400 text-sm">No. of Audits</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-[#F68E2D] font-bold">99%</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Active Alerts</div>
        </div>
        <div className="bg-[#181537] rounded-lg p-6 flex flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-[#F68E2D]">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F68E2D" strokeWidth="2"/></svg>
            </span>
            <span className="text-yellow-400 font-bold">LOW</span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Risk Level</div>
        </div>
      </div>
    </div>

    {/* Risk Indicator Table */}
    <div>
      <div className="text-white text-xl font-semibold mb-4">Risk Indicator</div>
      <div className="bg-[#181537] rounded-lg p-6">
        <table className="w-full">
          <tbody>
            {riskIndicators.map((indicator, idx) => (
              <tr key={idx} className="border-b border-[#23204a] last:border-b-0">
                <td className="py-3 text-white">{indicator}</td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-200 text-green-800 text-xs font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Compliant
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Compliances;