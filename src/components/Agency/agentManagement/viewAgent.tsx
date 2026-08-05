"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import CDPTraining from "./cdpTraining";
import Compliances from "./compliances";
import Audits from "./audits";

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

/*
const performance = [
  { label: "Visa refusal (85% - 100%)", value: 75, max: 75, color: "#F68E2D" },
  { label: "Enrollment (50% - 84%)", value: 24, max: 75, color: "#2563eb" },
  { label: "withdrawn Student (0% - 49%)", value: 1, max: 75, color: "#F68E2D" },
  { label: "Withdrawn Payment (50% - 79%)", value: 40, max: 75, color: "#F68E2D" },
  { label: "Academic Withdrawn (80% - 100%)", value: 75, max: 75, color: "#F68E2D" },
  { label: "Student Output Sucess(80% - 100%)", value: 50, max: 75, color: "#10b981" },
  { label: "Student Output Needs Improvement (60% - 79%)", value: 40, max: 75, color: "#10b981" },
  { label: "Student Output Unsatisfactory( Below 60%)", value: 30, max: 75, color: "#10b981" },
];
*/

const ViewAgent: React.FC<ViewAgentProps> = ({ agent, onClose }) => {
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits">("info");

  // Raise Complaint state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintType, setComplaintType] = useState("Service Issue");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const handleRaiseComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim()) {
      toast.error("Please provide a complaint description.");
      return;
    }
    setSubmittingComplaint(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          firstName: "Agent",
          lastName: "User",
          emailAddress: agent.email || "agent@aega.com",
          phoneNumber: agent.mobile || "N/A",
          countryOfResidence: agent.country || agent.location || "N/A",
          agentNameOrCompany: agent.name,
          typeOfComplaint: complaintType,
          complaintDescription: complaintDesc,
          targetType: "agent",
          targetId: agent.apiId || String(agent.id),
          acceptedDeclaration: true
        })
      });
      if (res.ok) {
        toast.success("Complaint submitted successfully!");
        setShowComplaintModal(false);
        setComplaintDesc("");
      } else {
        const errData = await res.json().catch(() => null);
        toast.error(errData?.error || errData?.message || "Failed to submit complaint.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit complaint.");
    } finally {
      setSubmittingComplaint(false);
    }
  };

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

        <button
          onClick={() => setShowComplaintModal(true)}
          className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span className="text-lg font-bold">+</span> Raise Complaint
        </button>
      </div>

      {activeTab === "cdp" ? (
        <CDPTraining targetId={agent.apiId} targetType="agent" />
      ) : activeTab === "compliances" ? (
        <Compliances targetId={agent.apiId} targetType="agent" />
      ) : activeTab === "audits" ? (
        <Audits targetId={agent.apiId} targetType="agent" />
      ) : (
        <>
          {/* AGENT INFORMATION */}
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <h2 className="text-white text-lg font-semibold mb-4">AGENT INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-sm">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Company Name :</span>
                  <span className="ml-2">{agent.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Email ID :</span>
                  <span className="ml-2">{agent.email}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Phone Number :</span>
                  <span className="ml-2">{agent.mobile}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Designation :</span>
                  <span className="ml-2">{agent.designation}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Office :</span>
                  <span className="ml-2">{agent.location}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Country :</span>
                  <span className="ml-2">{agent.country || agent.location || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE MATRIX COMMENTED OUT
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            ...
          </div>
          */}
        </>
      )}

      {/* RAISE COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#383B63] bg-[#14112E] p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-1">Raise Complaint</h2>
            <p className="text-xs text-white/60 mb-4">
              Submit a formal complaint for <span className="text-[#F68E2D] font-semibold">{agent.name}</span>
            </p>
            <form onSubmit={handleRaiseComplaintSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-white/80">Type of Complaint</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="h-10 w-full border border-[#383B63] bg-[#1A163E] px-3 text-sm outline-none text-white rounded cursor-pointer"
                >
                  <option value="Service Issue">Service Issue</option>
                  <option value="Compliance Breach">Compliance Breach</option>
                  <option value="Documentation Fraud">Documentation Fraud</option>
                  <option value="Communication Gap">Communication Gap</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-white/80">Complaint Description *</label>
                <textarea
                  rows={4}
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Describe your complaint details here..."
                  className="w-full border border-[#383B63] bg-[#1A163E] p-3 text-sm outline-none text-white rounded resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#383B63]">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded text-white"
                  disabled={submittingComplaint}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#F68E2D] hover:bg-[#e57d1f] rounded text-white font-semibold"
                  disabled={submittingComplaint}
                >
                  {submittingComplaint ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAgent;