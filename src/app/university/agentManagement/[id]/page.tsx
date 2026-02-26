"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ViewAgent from "@/components/agentManagement/viewAgent";
import DashboardLayout from "@/components/ui/dashboard-layout";
import CDPTraining from "@/components/agentManagement/cdpTraining";
import Compliances from "@/components/agentManagement/compliances";
import Audits from "@/components/agentManagement/audits";

// Dummy agent data for demo; replace with real fetch logic as needed
const agent = {
  id: 1,
  name: "Liam",
  verified: "blue" as "blue",
  mobile: "Decker",
  email: "liam@gmail.com",
  agency: "Liam",
  avatar: "/avatar.jpg",
  online: true,
};

export default function AgentDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits">("info");

  return (
    <DashboardLayout role="university">
      {/* Top Tabs and Raise Complaint */}
      <div className="flex items-center justify-between border-b border-[#F68E2D] pb-1 mb-6">
        <div className="flex gap-8">
          <button
            className={`font-semibold pb-2 px-1 border-b-2 ${
              activeTab === "info"
                ? "text-[#F68E2D] border-[#F68E2D]"
                : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
          <button
            className={`font-semibold pb-2 px-1 border-b-2 ${
              activeTab === "cdp"
                ? "text-[#F68E2D] border-[#F68E2D]"
                : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
            onClick={() => setActiveTab("cdp")}
          >
            CDP Training
          </button>
          <div className="relative group">
            <button
              className={`font-semibold pb-2 px-1 border-b-2 ${
                activeTab === "compliances"
                  ? "text-[#F68E2D] border-[#F68E2D]"
                  : "text-white border-transparent hover:text-[#F68E2D]"
              }`}
              onClick={() => setActiveTab("compliances")}
            >
              Compliances <span className="ml-1">&#9662;</span>
            </button>
            {/* Dropdown can go here if needed */}
          </div>
          <div className="relative group">
            <button
              className={`font-semibold pb-2 px-1 border-b-2 ${
                activeTab === "audits"
                  ? "text-[#F68E2D] border-[#F68E2D]"
                  : "text-white border-transparent hover:text-[#F68E2D]"
              }`}
              onClick={() => setActiveTab("audits")}
            >
              Audits <span className="ml-1">&#9662;</span>
            </button>
            {/* Dropdown can go here if needed */}
          </div>
        </div>
        <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded font-medium flex items-center gap-2">
          <span className="text-xl font-bold">+</span> Raise Complaint
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {activeTab === "info" && <ViewAgent agent={agent} />}
        {activeTab === "cdp" && <CDPTraining />}
        {activeTab === "compliances" && <Compliances />}
        {activeTab === "audits" && <Audits />}
      </div>
    </DashboardLayout>
  );
}