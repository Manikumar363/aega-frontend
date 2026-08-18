// src/components/auth/AgentBasicForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from 'lucide-react';

interface AgentFormData {
  businessType: "b2b" | "b2c";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AgentBasicFormProps {
  formData: AgentFormData;
  setFormData: (data: AgentFormData) => void;
  onNext: () => void;
}

export default function AgentBasicForm({ formData, setFormData, onNext }: AgentBasicFormProps) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return false;
    }

    if (formData.email.trim() !== formData.email) {
      setError("Leading/Trailing spaces are not allowed in the email field");
      toast.error("Leading/Trailing spaces are not allowed in the email field");
      return false;
    }

    // Name validations
    if (/[^a-zA-Z\s]/.test(formData.firstName) || /[^a-zA-Z\s]/.test(formData.lastName)) {
      setError("Names must only contain alphabetic characters");
      toast.error("Names must only contain alphabetic characters");
      return false;
    }

    // Spaces validations
    if (formData.email.includes(" ") || formData.password.includes(" ") || formData.confirmPassword.includes(" ")) {
      setError("Spaces are not allowed in email or password fields");
      toast.error("Spaces are not allowed in email or password fields");
      return false;
    }

    // Passwords match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return false;
    }

    // Strong password criteria validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      toast.error("Password does not meet strength requirements");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Basic details saved!");
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F58A07] text-sm font-bold text-white">
            1
          </div>
          <span className="text-xs text-[#F58A07]">Provide your Basic Details</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            2
          </div>
          <span className="text-xs text-white/60">Upload your Documents</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded bg-red-500/20 border border-red-500 px-4 py-2 text-sm text-red-200 text-left">
          {error}
        </div>
      )}

      {/* Business Type */}
      <div>
        <label className="mb-3 block text-xs text-white/70 text-left">Business Type*</label>
        <div className="grid grid-cols-2 gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-white">
            <input
              type="radio"
              name="businessType"
              value="b2b"
              checked={formData.businessType === "b2b"}
              onChange={(e) =>
                setFormData({
                  businessType: e.target.value as "b2b" | "b2c",
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                })
              }
              className="h-4 w-4 accent-[#F58A07]"
              required
            />
            <span className="text-sm">B2B Owner</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-white">
            <input
              type="radio"
              name="businessType"
              value="b2c"
              checked={formData.businessType === "b2c"}
              onChange={(e) =>
                setFormData({
                  businessType: e.target.value as "b2b" | "b2c",
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                })
              }
              className="h-4 w-4 accent-[#F58A07]"
            />
            <span className="text-sm">B2C Owner</span>
          </label>
        </div>
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-6 text-left">
        <div>
          <label className="mb-2 block text-xs text-white/70">First Name*</label>
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value.replace(/[^a-zA-Z]/g, "") })}
            required
            className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-white/70">Last Name*</label>
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value.replace(/[^a-zA-Z]/g, "") })}
            required
            className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
          />
        </div>
      </div>

      {/* Email */}
      <div className="text-left">
        <label className="mb-2 block text-xs text-white/70">Email*</label>
        <input
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value.replace(/\s/g, "") })}
          required
          className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
        />
      </div>

      {/* Password */}
      <div className="text-left">
        <label className="mb-2 block text-xs text-white/70">Password*</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value.replace(/\s/g, "") })}
            required
            className="w-full border border-white/30 bg-transparent pl-4 pr-12 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        <p className="mt-1 text-[10px] text-white/60 leading-normal">
          Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters. No spaces allowed.
        </p>
      </div>

      {/* Retype Password */}
      <div className="text-left">
        <label className="mb-2 block text-xs text-white/70">Retype Password*</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value.replace(/\s/g, "") })}
            required
            className="w-full border border-white/30 bg-transparent pl-4 pr-12 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      {/* Next Button */}
      <div className="text-left">
        <button
          type="submit"
          className="bg-[#F58A07] px-12 py-4 text-sm font-bold uppercase text-white hover:bg-[#e07b06] cursor-pointer"
        >
          NEXT
        </button>
      </div>

      {/* Sign In Link */}
      <p className="text-sm text-white/60 text-left">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#F58A07]">
          Sign In
        </Link>
      </p>
    </form>
  );
}
