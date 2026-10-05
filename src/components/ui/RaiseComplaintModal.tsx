"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

type RaiseComplaintModalProps = {
  defaultCompanyName?: string;
  defaultOffice?: string;
  targetType?: "company" | "agent" | "university";
  targetId?: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function RaiseComplaintModal({
  defaultCompanyName = "",
  defaultOffice = "",
  targetType = "company",
  targetId = "",
  onClose,
  onSuccess,
}: RaiseComplaintModalProps) {
  const [companyName, setCompanyName] = useState(defaultCompanyName);
  const [office, setOffice] = useState(defaultOffice || "London Office");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultCompanyName) {
      setCompanyName(defaultCompanyName);
    }
  }, [defaultCompanyName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameToSubmit = companyName.trim() || defaultCompanyName.trim();

    if (!nameToSubmit || !reason.trim() || !message.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      let userFirstName = "Agency";
      let userLastName = "User";
      let userEmail = "user@agency.com";

      try {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          userFirstName = parsed.firstName || parsed.fullName?.split(" ")[0] || parsed.name || "Agency";
          userLastName = parsed.lastName || parsed.fullName?.split(" ").slice(1).join(" ") || "User";
          userEmail = parsed.email || "user@agency.com";
        }
      } catch (e) {}

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/public`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            firstName: userFirstName,
            lastName: userLastName,
            emailAddress: userEmail,
            phoneNumber: "N/A",
            countryOfResidence: "UK",
            agentNameOrCompany: nameToSubmit,
            office: office.trim(),
            typeOfComplaint: reason.trim(),
            description: message.trim(),
            targetType,
            targetId,
            acceptedDeclaration: true,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to submit complaint.");
      }

      toast.success("Complaint submitted successfully!");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Complaint submission error:", err);
      toast.error(err.message || "Failed to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldLabel = targetType === "university" ? "University Name" : targetType === "agent" ? "Agent Name" : "Company Name";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 max-w-xl w-full text-white space-y-5 shadow-2xl">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-2xl font-bold text-white tracking-wide">Raise Complaint</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Entity Name */}
          <div>
            <label className="block font-semibold mb-1.5 text-gray-300">
              {fieldLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={fieldLabel}
              required
              disabled={isSubmitting}
              className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-[#F68E2D]"
            />
          </div>

          {/* Office */}
          <div>
            <label className="block font-semibold mb-1.5 text-gray-300">
              Office <span className="text-red-500">*</span>
            </label>
            <select
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D] cursor-pointer"
            >
              <option value="London Office">London Office</option>
              <option value="Head Office">Head Office</option>
              <option value="Regional Office">Regional Office</option>
              <option value="Branch Office">Branch Office</option>
            </select>
          </div>

          {/* Reason for Complaint */}
          <div>
            <label className="block font-semibold mb-1.5 text-gray-300">
              Reason for Complaint <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for complaint"
              required
              disabled={isSubmitting}
              className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-[#F68E2D]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold mb-1.5 text-gray-300">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              required
              disabled={isSubmitting}
              className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-[#F68E2D] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-3 bg-white text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#F68E2D] hover:bg-[#e28124] text-white rounded-lg text-sm font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
