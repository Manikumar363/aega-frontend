"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CDPTraining from "./cdpTraining";
import Compliances from "./compliances";
import Audits from "./audits";
import Agents from "./agents";
import RaiseComplaintModal from "@/components/ui/RaiseComplaintModal";

type Company = {
  id: number;
  apiId: string;
  name: string;
  designation: string;
  founderName?: string;
  owner?: string;
  country?: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: "blue" | "orange" | "red";
  online: boolean;
};

type ViewCompanyProps = {
  company: Company;
  onClose?: () => void;
};

const ViewCompany: React.FC<ViewCompanyProps> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits" | "agent">("info");
  const [detailedCompany, setDetailedCompany] = useState<any>(null);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Raise Complaint state
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  useEffect(() => {
    const loadCompanyData = async () => {
      const cid = company.apiId || String(company.id);
      if (!cid) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        // 1. Fetch company detailed overview
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies/${cid}/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const resData = await res.json();
          setDetailedCompany(resData);
        }

        // 2. Fetch sub-agents list
        const agentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent-management`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          const list = Array.isArray(agentsData) ? agentsData : [];
          const cidStr = String(cid);

          const filteredForCompany = list.filter((a: any) => {
            const aCompany = a.companyId || a.parentAgentId || a.creatorId || a.createdBy || a.agentId;
            return (
              String(aCompany) === cidStr ||
              String(aCompany?._id) === cidStr ||
              String(a.userId?._id || a.userId) === cidStr
            );
          });
          setAgentsList(filteredForCompany);
        }
      } catch (err) {
        console.error("Error loading company details or sub-agents:", err);
      } finally {
        setLoading(false);
      }
    };

    void loadCompanyData();
  }, [company.apiId, company.id]);

  const infoData = detailedCompany?.info || {};

  return (
    <div className="space-y-6 text-white">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#F68E2D] pb-2 mb-6">
        <div className="flex items-center gap-8 text-sm">
          <button
            onClick={() => setActiveTab("info")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "info" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"}`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab("cdp")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "cdp" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"}`}
          >
            CDP Training
          </button>
          <button
            onClick={() => setActiveTab("compliances")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "compliances" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"}`}
          >
            Compliances
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "audits" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"}`}
          >
            Audits
          </button>
          <button
            onClick={() => setActiveTab("agent")}
            className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "agent" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent hover:text-[#F68E2D]"}`}
          >
            Agents ({loading ? "..." : agentsList.length})
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
        <CDPTraining targetId={company.apiId} targetType="company" />
      ) : activeTab === "compliances" ? (
        <Compliances targetId={company.apiId} targetType="company" />
      ) : activeTab === "audits" ? (
        <Audits targetId={company.apiId} targetType="company" />
      ) : activeTab === "agent" ? (
        <Agents agentsList={agentsList} />
      ) : (
        /* COMPANY INFORMATION ONLY */
        <div className="bg-[#14112E] rounded-xl p-6 border border-gray-800 shadow-xl space-y-4">
          <h2 className="text-white text-lg font-bold uppercase tracking-wider text-[#F68E2D]">COMPANY INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Company Name</span>
                <span className="text-base font-bold text-white">{infoData.companyName || company.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Founder Name</span>
                <span className="text-sm font-semibold text-white">{infoData.founderName || company.founderName || company.owner || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Email ID</span>
                <span className="text-sm font-semibold text-white">{infoData.emailId || company.email}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Designation</span>
                <span className="text-sm font-semibold text-white">{infoData.designation || company.designation || "B2B"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Phone Number</span>
                <span className="text-sm font-semibold text-white">{infoData.mobileNumber || company.mobile}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block text-xs uppercase">Office &amp; Location</span>
                <span className="text-sm font-semibold text-white">{infoData.office || company.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RAISE COMPLAINT MODAL */}
      {showComplaintModal && (
        <RaiseComplaintModal
          defaultCompanyName={infoData.companyName || company.name}
          defaultOffice={infoData.office || company.location || "London Office"}
          targetType="company"
          targetId={company.apiId || String(company.id)}
          onClose={() => setShowComplaintModal(false)}
        />
      )}
    </div>
  );
};

export default ViewCompany;