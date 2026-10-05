"use client";

import React, { useState } from "react";
import CDPTraining from "./cdpTraining";
import Audits from "./audits";
import Compliances from "./compliances";
import RaiseComplaintModal from "@/components/ui/RaiseComplaintModal";

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

const Info: React.FC<ViewAgentProps> = ({ agent }) => {
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits">("info");
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-nowrap items-center justify-between border-b border-[#F68E2D] pb-2 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none max-w-full gap-4">
        <div className="flex items-center gap-4 sm:gap-8 text-sm shrink-0">
          <button
            onClick={() => setActiveTab("info")}
            className={`font-semibold pb-2 border-b-2 transition-colors shrink-0 ${
              activeTab === "info" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab("cdp")}
            className={`font-semibold pb-2 border-b-2 transition-colors shrink-0 ${
              activeTab === "cdp" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            CDP Training
          </button>
          <button
            onClick={() => setActiveTab("compliances")}
            className={`font-semibold pb-2 border-b-2 transition-colors shrink-0 ${
              activeTab === "compliances" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            Compliances
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`font-semibold pb-2 border-b-2 transition-colors shrink-0 ${
              activeTab === "audits" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
          >
            Audits
          </button>
        </div>

        <button
          onClick={() => setShowComplaintModal(true)}
          className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span className="text-base font-bold">+</span> Raise Complaint
        </button>
      </div>

      {activeTab === "cdp" ? (
        <CDPTraining targetId={agent.id} targetType="university" />
      ) : activeTab === "compliances" ? (
        <Compliances targetId={agent.id} targetType="university" />
      ) : activeTab === "audits" ? (
        <Audits targetId={agent.id} targetType="university" />
      ) : (
        /* UNIVERSITY INFORMATION ONLY */
        <div className="bg-[#14112E] rounded-xl p-6 border border-gray-800 shadow-xl space-y-4">
          <h2 className="text-white text-lg font-bold uppercase tracking-wider text-[#F68E2D]">UNIVERSITY INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">University Name</span>
                <span className="text-base font-bold text-white">{agent.name || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Phone Number</span>
                <span className="text-sm font-semibold text-white">{agent.mobile || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Location</span>
                <span className="text-sm font-semibold text-white">{agent.location || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Email Address</span>
                <span className="text-sm font-semibold text-white">{agent.email || "N/A"}</span>
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
          targetType="university"
          targetId={agent.id}
          onClose={() => setShowComplaintModal(false)}
        />
      )}
    </div>
  );
};

export default Info;