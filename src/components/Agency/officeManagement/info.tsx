"use client";

import React, { useState, useEffect } from "react";
import CDPTraining from "./cdpTraining";
import Audits from "./audits";
import Compliances from "./compliances";
import Employee from "./employee";
import toast from "react-hot-toast";

type OfficeData = {
  _id: string;
  agentId: string;
  location: string;
  fullAddress: string;
  email: string;
  mobileNumber: string;
  employees: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ViewAgentProps = {
  officeId: string;
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

const Info: React.FC<ViewAgentProps> = ({ officeId, onClose }) => {
  const [office, setOffice] = useState<OfficeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits" | "employee">("info");

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offices/${officeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch office details");
        }

        const data: OfficeData = await response.json();
        setOffice(data);
      } catch (error) {
        console.error("Error fetching office details:", error);
        toast.error("Failed to load office details");
      } finally {
        setLoading(false);
      }
    };

    if (officeId) {
      fetchOfficeDetails();
    }
  }, [officeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D]"></div>
          <p className="mt-4">Loading office details...</p>
        </div>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="text-white text-center py-12">
        <p>No office details found</p>
      </div>
    );
  }

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
            onClick={() => setActiveTab("employee")}
            className={`font-semibold pb-2 border-b-2 ${activeTab === "employee" ? "text-[#F68E2D] border-[#F68E2D]" : "text-white border-transparent"}`}
          >
            Employee
          </button>
        </div>

        <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded font-medium flex items-center gap-2 transition-colors">
          <span className="text-lg font-bold">+</span> Raise Complaint
        </button>
      </div>

      {activeTab === "cdp" ? (
        <CDPTraining />
      ) : activeTab === "compliances" ? (
        <Compliances />
      ) : activeTab === "audits" ? (
        <Audits />
      ) : activeTab === "employee" ? (
        <Employee />
      ) : (
        <>
          {/* OFFICE INFORMATION */}
          <div className="bg-[#14112E] rounded-lg p-6 border border-[#2C2A45]">
            <h2 className="text-white text-lg font-semibold mb-4">OFFICE INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-sm">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Location :</span>
                  <span className="ml-2">{office.location}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Email ID :</span>
                  <span className="ml-2">{office.email}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Full Address :</span>
                  <span className="ml-2">{office.fullAddress}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Mobile Number :</span>
                  <span className="ml-2">{office.mobileNumber}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Total Employees :</span>
                  <span className="ml-2">{office.employees.length}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-400">Office ID :</span>
                  <span className="ml-2 text-xs font-mono">{office._id}</span>
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

export default Info;