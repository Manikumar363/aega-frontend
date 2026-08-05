"use client";

import React, { useState } from "react";
import CDPTraining from "./cdpTraining";
import Audits from "./audits";
import Compliances from "./compliances";


type Agent = {
  id: string;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: "blue" | "orange" | "red";
  online: boolean;
};

type ViewAgentProps = {
  agent: Agent;
  onClose?: () => void;
};

const getPerformanceData = (period: "weekly" | "monthly" | "yearly") => {
  const multiplier = period === "weekly" ? 1 : period === "monthly" ? 4 : 48;
  return [
    { label: "Visa refusal (85% - 100%)", value: Math.min(75, Math.round(12 * (multiplier / 4))), max: 75, color: "#F68E2D" },
    { label: "Enrollment (50% - 84%)", value: Math.min(75, Math.round(24 * (multiplier / 4))), max: 75, color: "#2563eb" },
    { label: "Withdrawn Student (0% - 49%)", value: Math.min(75, Math.round(2 * (multiplier / 4))), max: 75, color: "#F68E2D" },
    { label: "Withdrawn Payment (50% - 79%)", value: Math.min(75, Math.round(35 * (multiplier / 4))), max: 75, color: "#F68E2D" },
    { label: "Academic Withdrawn (80% - 100%)", value: Math.min(75, Math.round(15 * (multiplier / 4))), max: 75, color: "#F68E2D" },
    { label: "Student Output Success (80% - 100%)", value: Math.min(75, Math.round(55 * (multiplier / 4))), max: 75, color: "#10b981" },
    { label: "Student Output Needs Improvement (60% - 79%)", value: Math.min(75, Math.round(40 * (multiplier / 4))), max: 75, color: "#10b981" },
    { label: "Student Output Unsatisfactory (Below 60%)", value: Math.min(75, Math.round(18 * (multiplier / 4))), max: 75, color: "#10b981" },
  ];
};

const Info: React.FC<ViewAgentProps> = ({ agent }) => {
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits">("info");

  const performance = getPerformanceData(timePeriod);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#F68E2D] pb-2 mb-6">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`font-semibold pb-2 border-b-2 ${activeTab === "info" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent"}`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab("cdp")}
            className={`font-semibold pb-2 border-b-2 ${activeTab === "cdp" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent"}`}
          >
            CDP Training
          </button>
          <button
            onClick={() => setActiveTab("compliances")}
            className={`font-semibold pb-2 border-b-2 ${activeTab === "compliances" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent"}`}
          >
            Compliances
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`font-semibold pb-2 border-b-2 ${activeTab === "audits" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent"}`}
          >
            Audits
          </button>
        </div>

        <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded font-medium flex items-center gap-2 transition-colors">
          <span className="text-lg font-bold">+</span> Raise Complaint
        </button>
      </div>

      {activeTab === "cdp" ? (
        <CDPTraining targetId={agent.id} targetType="university" />
      ) : activeTab === "compliances" ? (
        <Compliances targetId={agent.id} targetType="university" />
      ) : activeTab === "audits" ? (
        <Audits targetId={agent.id} targetType="university" />
      ) : (
        <>
          {/* UNIVERSITY INFORMATION */}
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <h2 className="text-white text-lg font-semibold mb-4 border-b border-[#2C2A45] pb-2">UNIVERSITY INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-sm">
              <div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-400">University Name :</span>
                  <span className="ml-2 font-medium">{agent.name || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Phone Number :</span>
                  <span className="ml-2">{agent.mobile || "N/A"}</span>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-400">Location :</span>
                  <span className="ml-2">{agent.location || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">EMail :</span>
                  <span className="ml-2">{agent.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE MATRIX
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">PERFORMANCE MATRIX</h2>
              <div className="flex gap-2">
                {(["weekly", "monthly", "yearly"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      timePeriod === period
                        ? "bg-[#F68E2D] text-white"
                        : "bg-transparent text-white/70 hover:text-white border border-white/20"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {performance.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>{item.label}</span>
                    <span className="font-semibold">
                      {String(item.value).padStart(2, "0")}/{item.max}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>. */}
        </>
      )}
    </div>
  );
};

export default Info;