"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function AgentCompliancesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const statsData = [
    { icon: <ComplianceIcon />, label: "Active Issue", value: "1", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Over All Score", value: "99%", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Risk Level", value: "LOW", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: "15", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Active Alerts", value: "99%", color: "#F68E2D" },
    { icon: <ComplianceIcon />, label: "Risk Level", value: "LOW", color: "#F68E2D" },
  ];

  const riskIndicators = [
    { name: "Documentation", status: "Compliant" },
    { name: "Training Current", status: "Compliant" },
    { name: "Basic Compliances Assesment", status: "Compliant" },
    { name: "Financial Health", status: "Compliant" },
    { name: "Visa Refusal Enrollment", status: "Compliant" },
  ];

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Top Tab */}
        <div className="flex gap-8 border-b border-gray-700">
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
          <button
            onClick={() => setActiveTab("locations")}
            className={`pb-3 text-sm font-light transition-colors flex items-center gap-1 ${
              activeTab === "locations"
                ? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Hyderabad <ChevronDown size={16}/>
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`pb-3 text-sm font-light transition-colors flex items-center gap-1 ${
              activeTab === "locations"
                ? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Banglore <ChevronDown size={16}/>
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`pb-3 text-sm font-light transition-colors flex items-center gap-1 ${
              activeTab === "locations"
                ? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
                : "text-white/60 hover:text-white"
            }`}
          >
           Noida <ChevronDown size={16}/>
          </button>
        </div>

        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-white font-medium text-2xl">Compliance Overview</h1>
          <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-8 py-3 rounded-md flex items-center gap-2 font-medium transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Compliances
          </button>
        </div>

        {/* Stats Grid - 2 Rows x 3 Columns */}
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-0 border border-gray-800 bg-[#14112E]">
            {statsData.slice(0, 3).map((stat, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-6 ${
                  index < 2 ? "border-r border-gray-800" : ""
                }`}
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
          <div className="grid grid-cols-3 gap-0 border border-gray-800 bg-[#14112E]">
            {statsData.slice(3, 6).map((stat, index) => (
              <div
                key={index + 3}
                className={`flex items-center justify-between p-6 ${
                  index < 2 ? "border-r border-gray-800" : ""
                }`}
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
          
          <div className="space-y-1">
            {riskIndicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-[#0a0820] border border-gray-800 rounded-lg p-5 flex items-center justify-between hover:bg-[#1a1640] transition-colors"
              >
                <span className="text-white text-base">{indicator.name}</span>
                <span className="bg-[#10B981] text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  {indicator.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}