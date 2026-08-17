"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { getAuthToken } from "@/lib/api";

export default function UniversityPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const meetsMinLength = newPassword.length >= 8;
  const meetsUppercase = /[A-Z]/.test(newPassword);
  const meetsLowercase = /[a-z]/.test(newPassword);
  const meetsNumber = /\d/.test(newPassword);
  const meetsSpecial = /[!@#$%^&*()_+[\]{};':",./<>?~`|\\-]/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    if (!meetsMinLength || !meetsUppercase || !meetsLowercase || !meetsNumber || !meetsSpecial) {
      toast.error("New password does not meet the complexity requirements.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || resData.message || "Failed to update password.");
      }

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCriteria = (label: string, met: boolean) => (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      {met ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-red-500" />}
      <span className={met ? "text-emerald-400/80" : "text-gray-400"}>{label}</span>
    </div>
  );

  return (
    <DashboardLayout role="university">
      <div className="max-w-xl mx-auto space-y-6 text-white text-left pb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-wide uppercase">Password &amp; Security</h1>
          <p className="text-sm text-gray-400">Manage your institution portal credentials and account safety.</p>
        </div>

        <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
          <h3 className="text-md font-bold uppercase text-[#F68E2D] border-b border-gray-800 pb-2">Change Account Password</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-gray-400 font-semibold">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 pr-12 text-white outline-none focus:border-[#F68E2D]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-400 font-semibold">New Password *</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 pr-12 text-white outline-none focus:border-[#F68E2D]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-400 font-semibold">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 pr-12 text-white outline-none focus:border-[#F68E2D]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {newPassword && (
              <div className="bg-[#0A0724] border border-gray-800 rounded-lg p-4 space-y-2">
                <span className="font-semibold text-white/90 block mb-1">Complexity Requirements:</span>
                {renderCriteria("At least 8 characters", meetsMinLength)}
                {renderCriteria("At least one uppercase letter (A-Z)", meetsUppercase)}
                {renderCriteria("At least one lowercase letter (a-z)", meetsLowercase)}
                {renderCriteria("At least one numeric digit (0-9)", meetsNumber)}
                {renderCriteria("At least one special character (!@#...)", meetsSpecial)}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#F68E2D] hover:bg-[#e28124] text-white py-2.5 rounded-lg font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
