"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

type OfficeData = {
  _id: string;
  agentId: string;
  location: string;
  fullAddress: string;
  email: string;
  mobileNumber: string;
  employees: any[];
  numberOfEmployees?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ViewAgentProps = {
  officeId: string;
  onClose?: () => void;
};

const Info: React.FC<ViewAgentProps> = ({ officeId }) => {
  const [office, setOffice] = useState<OfficeData | null>(null);
  const [loading, setLoading] = useState(true);

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
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#F68E2D]"></div>
          <p className="mt-3 text-xs text-gray-300">Loading office details...</p>
        </div>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="text-white text-center py-12">
        <p className="text-sm text-gray-400">No office details found.</p>
      </div>
    );
  }

  const employeeCount = typeof office.numberOfEmployees === "number" ? office.numberOfEmployees : (Array.isArray(office.employees) ? office.employees.length : 0);

  return (
    <div className="space-y-6 text-white">
      {/* Title */}
      <div className="border-b border-[#F68E2D] pb-3">
        <h2 className="text-2xl font-bold text-[#F68E2D]">Office Information</h2>
        <p className="text-xs text-gray-400 mt-0.5">Overview and details for {office.location}</p>
      </div>

      {/* Office Information Cards Grid */}
      <div className="bg-[#14123A] border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-[#0A0724] border border-gray-800 p-4 rounded-lg space-y-1">
            <span className="text-gray-400 font-semibold uppercase block text-[10px]">Location / Name</span>
            <span className="text-base font-bold text-white">{office.location}</span>
          </div>

          <div className="bg-[#0A0724] border border-gray-800 p-4 rounded-lg space-y-1">
            <span className="text-gray-400 font-semibold uppercase block text-[10px]">Total Employees</span>
            <span className="text-base font-bold text-[#F68E2D]">{employeeCount}</span>
          </div>

          <div className="bg-[#0A0724] border border-gray-800 p-4 rounded-lg space-y-1">
            <span className="text-gray-400 font-semibold uppercase block text-[10px]">Email Address</span>
            <span className="text-sm font-semibold text-white">{office.email}</span>
          </div>

          <div className="bg-[#0A0724] border border-gray-800 p-4 rounded-lg space-y-1">
            <span className="text-gray-400 font-semibold uppercase block text-[10px]">Mobile Number</span>
            <span className="text-sm font-semibold text-white">{office.mobileNumber}</span>
          </div>
        </div>

        <div className="bg-[#0A0724] border border-gray-800 p-4 rounded-lg space-y-1 text-xs">
          <span className="text-gray-400 font-semibold uppercase block text-[10px]">Full Registered Address</span>
          <span className="text-sm font-semibold text-white leading-relaxed">{office.fullAddress}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400 pt-2 border-t border-gray-800">
          <div>
            Registered Date: <span className="text-white font-medium">{new Date(office.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            Last Updated: <span className="text-white font-medium">{new Date(office.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;