// src/components/auth/UniversityBasicForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface UniversityBasicFormProps {
  onNext: () => void;
}

export default function UniversityBasicForm({ onNext }: UniversityBasicFormProps) {
  const [formData, setFormData] = useState({
    businessType: "b2b" as "b2b" | "b2c",
    universityName: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("University Basic:", formData);
    onNext();
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

      {/* Business Type */}
      <div>
        <label className="mb-3 block text-xs text-white/70">Business Type*</label>
        <div className="grid grid-cols-2 gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-white">
            <input
              type="radio"
              name="businessType"
              value="b2b"
              checked={formData.businessType === "b2b"}
              onChange={(e) =>
                setFormData({ ...formData, businessType: e.target.value as "b2b" | "b2c" })
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
                setFormData({ ...formData, businessType: e.target.value as "b2b" | "b2c" })
              }
              className="h-4 w-4 accent-[#F58A07]"
            />
            <span className="text-sm">B2C Owner</span>
          </label>
        </div>
      </div>

      {/* University Name */}
      <div>
        <label className="mb-2 block text-xs text-white/70">University Name*</label>
        <input
          type="text"
          placeholder="University Name"
          value={formData.universityName}
          onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
          required
          className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-xs text-white/70">Email*</label>
        <input
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-xs text-white/70">Password*</label>
        <input
          type="password"
          placeholder="••••••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
        />
      </div>

      {/* Retype Password */}
      <div>
        <label className="mb-2 block text-xs text-white/70">Retype Password*</label>
        <input
          type="password"
          placeholder="••••••••••••"
          value={formData.retypePassword}
          onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
          required
          className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
        />
      </div>

      {/* Next Button */}
      <button
        type="submit"
        className="bg-[#F58A07] px-12 py-4 text-sm font-bold uppercase text-white hover:bg-[#e07b06]"
      >
        NEXT
      </button>

      {/* Sign In Link */}
      <p className="text-sm text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#F58A07]">
          Sign In
        </Link>
      </p>
    </form>
  );
}
