"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import CDPTraining from "./cdpTraining";
import Compliances from "./compliances";
import Audits from "./audits";
import RaiseComplaintModal from "@/components/ui/RaiseComplaintModal";

type Agent = {
  id: number;
  apiId: string;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  country?: string;
  avatar: string;
  verified: "blue" | "orange" | "red";
  online: boolean;
};

type ViewAgentProps = {
  agent: Agent;
  onClose?: () => void;
};

const ViewAgent: React.FC<ViewAgentProps> = ({ agent }) => {
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits">("info");
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  return (
    <div className="space-y-6 text-white">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#F68E2D] pb-2 mb-6">
        <div className="flex items-center gap-8 text-sm">
          <button
            onClick={() => setActiveTab("info")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === "info" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab("cdp")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === "cdp" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            CDP Training
          </button>
          <button
            onClick={() => setActiveTab("compliances")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === "compliances" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            Compliances
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === "audits" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            Audits
          </button>
        </div>

        <button
          onClick={() => setShowComplaintModal(true)}
          className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2 rounded-lg font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="text-base font-bold">+</span> Raise Complaint
        </button>
      </div>

      {activeTab === "cdp" ? (
        <CDPTraining targetId={agent.apiId} targetType="agent" />
      ) : activeTab === "compliances" ? (
        <Compliances targetId={agent.apiId} targetType="agent" />
      ) : activeTab === "audits" ? (
        <Audits targetId={agent.apiId} targetType="agent" />
      ) : (
        /* AGENT INFORMATION ONLY */
        <div className="bg-[#14112E] rounded-xl p-6 border border-gray-800 shadow-xl space-y-4">
          <h2 className="text-white text-lg font-bold uppercase tracking-wider text-[#F68E2D]">AGENT INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Full Name</span>
                <span className="text-base font-bold text-white">{agent.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Email ID</span>
                <span className="text-sm font-semibold text-white">{agent.email}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Designation</span>
                <span className="text-sm font-semibold text-white">{agent.designation}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Mobile Number</span>
                <span className="text-sm font-semibold text-white">{agent.mobile}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Office &amp; Location</span>
                <span className="text-sm font-semibold text-white">{agent.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RAISE COMPLAINT MODAL */}
      {showComplaintModal && (
        <RaiseComplaintModal
          defaultCompanyName={agent.name}
          defaultOffice={agent.location || "Head Office"}
          targetType="agent"
          targetId={agent.apiId || String(agent.id)}
          onClose={() => setShowComplaintModal(false)}
        />
      )}
    </div>
  );
};

export default ViewAgent;