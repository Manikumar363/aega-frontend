"use client";

import React from "react";
import { X } from "lucide-react";

interface LeaveRequest {
  id: string;
  name: string;
  designation: string;
  image?: string | null;
  startDate: string;
  endDate: string;
  leaveType: string;
  title: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface LeaveRequestModalProps {
  leave: LeaveRequest;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function LeaveRequestModal({
  leave,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  onClose,
}: LeaveRequestModalProps) {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#14123A] border border-[#2E325D] p-4 sm:p-6 rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Title */}
        <h2 className="text-white text-2xl font-semibold mb-6">Leave Request</h2>

        {/* Leave Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <p className="text-white text-base mb-2">Name:</p>
              <p className="text-white text-base">{leave.name}</p>
            </div>

            {/* Leave Type */}
            <div>
              <p className="text-white text-base mb-2">Leave Type:</p>
              <p className="text-white text-base">{leave.leaveType}</p>
            </div>

            {/* Start Date */}
            <div>
              <p className="text-white text-base mb-2">Start Date:</p>
              <p className="text-white text-base">{formatDate(leave.startDate)}</p>
            </div>

            {/* Reason */}
            <div>
              <p className="text-white text-base mb-2">Reason:</p>
              <p className="text-white text-base">{leave.reason}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Designation */}
            <div>
              <p className="text-white text-base mb-2">Designation:</p>
              <p className="text-white text-base">{leave.designation}</p>
            </div>

            {/* Title */}
            <div>
              <p className="text-white text-base mb-2">Title:</p>
              <p className="text-white text-base">{leave.title}</p>
            </div>

            {/* End Date */}
            <div>
              <p className="text-white text-base mb-2">End Date:</p>
              <p className="text-white text-base">{formatDate(leave.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {leave.status === "Pending" ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-6">
            <button
              onClick={onReject}
              disabled={isRejecting || isApproving}
              className="w-full sm:w-52 bg-[#ED3941] hover:bg-[#d1323a] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRejecting ? "Rejecting..." : "Decline"}
            </button>
            <button
              onClick={onApprove}
              disabled={isApproving || isRejecting}
              className="w-full sm:w-52 bg-[#22C55E] hover:bg-[#1ea852] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? "Approving..." : "Accept"}
            </button>
          </div>
        ) : (
          <div className="text-center mt-6">
            <div
              className={`inline-block px-6 py-3 rounded-lg font-semibold ${
                leave.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Already {leave.status}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
