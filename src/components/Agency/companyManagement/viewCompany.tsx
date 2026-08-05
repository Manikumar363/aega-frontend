"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CDPTraining from "./cdpTraining";
import Compliances from "./compliances";
import Audits from "./audits";
import Agents from "./agents";

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

const matrixConfig = [
  { key: "visaRefusal", label: "Visa refusal (85% - 100%)", defaultVal: 75, max: 100, color: "#F68E2D" },
  { key: "enrollment", label: "Enrollment (50% - 84%)", defaultVal: 24, max: 100, color: "#2563eb" },
  { key: "withdrawnStudent", label: "Withdrawn Student (0% - 49%)", defaultVal: 1, max: 100, color: "#F68E2D" },
  { key: "withdrawnPayment", label: "Withdrawn Payment (50% - 79%)", defaultVal: 40, max: 100, color: "#F68E2D" },
  { key: "academicWithdrawn", label: "Academic Withdrawn (80% - 100%)", defaultVal: 75, max: 100, color: "#F68E2D" },
  { key: "studentOutputSuccess", label: "Student Output Success (80% - 100%)", defaultVal: 50, max: 100, color: "#10b981" },
];

const ViewCompany: React.FC<ViewCompanyProps> = ({ company, onClose }) => {
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits" | "agent">("info");

  const [detailedCompany, setDetailedCompany] = useState<any>(null);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Raise Complaint state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintType, setComplaintType] = useState("Service Issue");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  useEffect(() => {
    const loadCompanyData = async () => {
      const cid = company.apiId || String(company.id);
      if (!cid) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        // 1. Fetch company detailed overview
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies/${cid}/overview`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const resData = await res.json();
          setDetailedCompany(resData);
        }

        // 2. Fetch sub-agents list filtered specifically for this company
        const agentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent-management`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
          firstName: "Agency",
          lastName: "User",
          emailAddress: company.email || "agency@aega.com",
          phoneNumber: company.mobile || "N/A",
          countryOfResidence: infoData.country || company.country || company.location || "N/A",
          agentNameOrCompany: infoData.companyName || company.name,
          typeOfComplaint: complaintType,
          complaintDescription: complaintDesc,
          targetType: "company",
          targetId: company.apiId || String(company.id),
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

  const infoData = detailedCompany?.info || {};
  const matrixData = detailedCompany?.performanceMatrix || {};

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
          <button
            onClick={() => setActiveTab("agent")}
            className={`font-semibold pb-2 border-b-2 ${activeTab === "agent" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent"}`}
          >
            Agents ({loading ? "..." : agentsList.length})
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
        <CDPTraining targetId={company.apiId} targetType="company" />
      ) : activeTab === "compliances" ? (
        <Compliances targetId={company.apiId} targetType="company" />
      ) : activeTab === "audits" ? (
        <Audits targetId={company.apiId} targetType="company" />
      ) : activeTab === "agent" ? (
        <Agents agentsList={agentsList} />
      ) : (
        <>
          {/* COMPANY INFORMATION */}
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <h2 className="text-white text-lg font-semibold mb-4">COMPANY INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-sm">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Company Name :</span>
                  <span className="ml-2">{infoData.companyName || company.name}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Founder Name :</span>
                  <span className="ml-2">{infoData.founderName || company.founderName || company.owner || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Email ID :</span>
                  <span className="ml-2">{infoData.emailId || company.email}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Designation :</span>
                  <span className="ml-2">{infoData.designation || company.designation || "B2B"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Phone Number :</span>
                  <span className="ml-2">{infoData.mobileNumber || company.mobile}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Office :</span>
                  <span className="ml-2">{infoData.office || company.location}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Country :</span>
                  <span className="ml-2">{infoData.country || company.country || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE MATRIX */}
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
              {matrixConfig.map((item, idx) => {
                const itemData = matrixData[item.key] || {};
                const val = Number.isFinite(itemData[timePeriod]) ? itemData[timePeriod] : item.defaultVal;
                const max = itemData.max || item.max;
                const pct = Math.min(100, Math.max(0, (val / max) * 100));

                return (
                  <div key={idx}>
                    <div className="flex justify-between text-white text-sm mb-2">
                      <span>{item.label}</span>
                      <span className="font-semibold">
                        {String(val).padStart(2, "0")}/{max}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* RAISE COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#383B63] bg-[#14112E] p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-1">Raise Complaint</h2>
            <p className="text-xs text-white/60 mb-4">
              Submit a formal complaint for <span className="text-[#F68E2D] font-semibold">{infoData.companyName || company.name}</span>
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

export default ViewCompany;