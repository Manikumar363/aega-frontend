"use client";

import React, { useState, useEffect } from "react";
import CDPTraining from "./cdpTraining";
import Compliances from "./compliances";
import Audits from "./audits";
import Agents from "./agents";

type Company = {
  id: number;
  apiId: string;
  name: string;
  designation: string;
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

const ViewCompany: React.FC<ViewCompanyProps> = ({ company, onClose }) => {
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits" | "agent">("info");

  const [detailedCompany, setDetailedCompany] = useState<any>(null);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

        // 2. Fetch sub-agents/counsellors list
        const agentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent-management`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          setAgentsList(agentsData || []);
        }
      } catch (err) {
        console.error("Error loading company details or sub-agents:", err);
      } finally {
        setLoading(false);
      }
    };

    void loadCompanyData();
  }, [company.apiId, company.id]);

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

        <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded font-medium flex items-center gap-2 transition-colors">
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
          {/* AGENT INFORMATION */}
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <h2 className="text-white text-lg font-semibold mb-4">AGENT INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-sm">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">First Name :</span>
                  <span className="ml-2">{company.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Email ID :</span>
                  <span className="ml-2">{company.email}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Last Name :</span>
                  <span className="ml-2">Decker</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Phone Number :</span>
                  <span className="ml-2">{company.mobile}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Designation :</span>
                  <span className="ml-2">{company.designation}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Office :</span>
                  <span className="ml-2">{company.location}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Total Agents :</span>
                  <span className="ml-2">{loading ? "Loading..." : agentsList.length}</span>
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
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCompany;