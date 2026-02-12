// src/components/auth/AgentDocumentsForm.tsx
"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function AgentDocumentsForm() {
  const [files, setFiles] = useState({
    document1: null,
    document2: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Agent Documents:", files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            1
          </div>
          <span className="text-xs text-white/60">Provide your Basic Details</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F58A07] text-sm font-bold text-white">
            2
          </div>
          <span className="text-xs text-[#F58A07]">Upload your Documents</span>
        </div>
      </div>

      {/* Supporting Document 1 */}
      <div>
        <label className="mb-2 block text-xs text-white/70">Supporting Document 1*</label>
        <div className="border-2 border-dashed border-white/30 bg-white/5 p-8 text-center transition-colors hover:border-[#F58A07]">
          <Upload className="mx-auto mb-2 h-8 w-8 text-white/40" />
          <p className="text-sm text-white/70">Drop files here or click to upload</p>
          <p className="text-xs text-white/40">Emails, documents, screenshots (PDF, JPG, PNG - max 10MB each)</p>
        </div>
      </div>

      {/* Supporting Document 2 */}
      <div>
        <label className="mb-2 block text-xs text-white/70">Supporting Document 2*</label>
        <div className="border-2 border-dashed border-white/30 bg-white/5 p-8 text-center transition-colors hover:border-[#F58A07]">
          <Upload className="mx-auto mb-2 h-8 w-8 text-white/40" />
          <p className="text-sm text-white/70">Drop files here or click to upload</p>
          <p className="text-xs text-white/40">Emails, documents, screenshots (PDF, JPG, PNG - max 10MB each)</p>
        </div>
      </div>

      {/* reCAPTCHA */}
      <div className="flex items-center justify-between border border-white/20 bg-white px-4 py-3">
        <label className="flex items-center gap-3">
          <input type="checkbox" required className="h-5 w-5" />
          <span className="text-sm text-gray-800">I'm not a robot</span>
        </label>
        <span className="text-xs text-gray-500">reCAPTCHA</span>
      </div>

      {/* Sign Up Button */}
      <a
        href="/agent/dashboard"
        className="inline-block bg-[#F58A07] px-12 py-4 text-sm font-bold uppercase text-white hover:bg-[#e07b06]"
      >
        SIGN UP
      </a>
    </form>
  );
}
