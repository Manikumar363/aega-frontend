"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function ComplaintPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryOfResidence: "",
    agentName: "",
    agentReference: "",
    typeOfComplaint: "",
    complaintDescription: "",
    supportingEvidence: "",
    termsAccepted: false,
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData, files);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0A1628] py-20">
      {/* Orange gradient accent - top right */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-[50%] bg-gradient-to-bl from-[#F58A07]/20 via-[#C86A2A]/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-10">
        {/* Page Header */}
        <div className="mb-12">
          <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/60">
            FOR THE PUBLIC
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Student Complaint Form
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            If you've experienced issues with an AEGA member agent or institution, please submit your complaint below. All information will be treated confidentially and investigated thoroughly.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0F1A3A] border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-10 p-8 md:p-12">
            
            {/* Section 1: Your Information */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#F58A07] pl-4">
                <h2 className="text-xl font-bold text-white">Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                    First Name <span className="text-[#F58A07]">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border-b-2 border-white/20 bg-transparent px-0 py-3 text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                    Last Name <span className="text-[#F58A07]">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full border-b-2 border-white/20 bg-transparent px-0 py-3 text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                    Email Address <span className="text-[#F58A07]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b-2 border-white/20 bg-transparent px-0 py-3 text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                    Phone Number <span className="text-[#F58A07]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+1 (123) 456-7890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full border-b-2 border-white/20 bg-transparent px-0 py-3 text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                  Country of Residence <span className="text-[#F58A07]">*</span>
                </label>
                <input
                  type="text"
                  name="countryOfResidence"
                  placeholder="Enter your country"
                  value={formData.countryOfResidence}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-white/20 bg-transparent px-0 py-3 text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                />
              </div>
            </div>

            {/* Section 2: Agent Details */}
            <div className="space-y-6 border-t border-white/10 pt-10">
              <div className="border-l-4 border-[#F58A07] pl-4">
                <h2 className="text-xl font-bold text-white">Agent Details</h2>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                  Agent's Name or Company <span className="text-[#F58A07]">*</span>
                </label>
                <input
                  type="text"
                  name="agentName"
                  placeholder="Enter agent or company name"
                  value={formData.agentName}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-white/20 bg-transparent px-0 py-3 text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                  AEGA Reference Number (if known)
                </label>
                <input
                  type="text"
                  name="agentReference"
                  placeholder="Or any detail to help identify the agent or counsellor"
                  value={formData.agentReference}
                  onChange={handleChange}
                  className="w-full border-b-2 border-white/20 bg-transparent px-0 py-3 text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                />
                <p className="mt-2 text-xs text-white/50">
                  Include website, social media, or any reference materials you have
                </p>
              </div>
            </div>

            {/* Section 3: Complaint Details */}
            <div className="space-y-6 border-t border-white/10 pt-10">
              <div className="border-l-4 border-[#F58A07] pl-4">
                <h2 className="text-xl font-bold text-white">Complaint Details</h2>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                  Type of Complaint <span className="text-[#F58A07]">*</span>
                </label>
                <select
                  name="typeOfComplaint"
                  value={formData.typeOfComplaint}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-white/20 bg-[#0A1628] px-0 py-3 text-white transition-colors focus:border-[#F58A07] focus:outline-none"
                >
                  <option value="">Select Issue Type</option>
                  <option value="misconduct">Agent Misconduct</option>
                  <option value="fraud">Fraudulent Activity</option>
                  <option value="misrepresentation">Misrepresentation</option>
                  <option value="financial">Financial Issues</option>
                  <option value="communication">Poor Communication</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
                  Description <span className="text-[#F58A07]">*</span>
                </label>
                <textarea
                  name="complaintDescription"
                  placeholder="Please provide a detailed description including:&#10;• What happened?&#10;• When did it happen?&#10;• Names of individuals involved&#10;• Financial figures (if applicable)&#10;• Any other relevant details"
                  value={formData.complaintDescription}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full resize-none border border-white/20 bg-[#0A1628] px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-[#F58A07] focus:outline-none"
                />
              </div>
            </div>

            {/* Section 4: Supporting Evidence */}
            <div className="space-y-6 border-t border-white/10 pt-10">
              <div className="border-l-4 border-[#F58A07] pl-4">
                <h2 className="text-xl font-bold text-white">Supporting Evidence</h2>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-white/20 bg-[#0A1628] p-10 text-center transition-colors hover:border-[#F58A07]/50">
                <div className="mx-auto flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-white/5 p-6">
                    <Upload className="h-10 w-10 text-[#F58A07]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Drag and drop files here
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      or click to browse from your device
                    </p>
                  </div>
                  <p className="text-xs text-white/40">
                    PDF, PNG, JPG • Max 10MB per file
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="inline-block border border-white/30 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-[#F58A07] hover:bg-[#F58A07]">
                      Choose Files
                    </span>
                  </label>
                </div>
                
                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-2 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                      Selected Files ({files.length})
                    </p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border border-white/10 bg-[#0F1A3A] px-4 py-2"
                        >
                          <span className="text-sm text-white">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-white/50 transition-colors hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="space-y-6 border-t border-white/10 pt-10">
              <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-[#0A1628] p-6">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                  className="mt-0.5 h-5 w-5 cursor-pointer accent-[#F58A07]"
                />
                <label className="text-xs leading-relaxed text-white/70">
                  I acknowledge that false information provided in this complaint is a legal offense under UK law. I understand that AEGA may share relevant details with universities, government authorities, regulatory bodies, and student protection partners to investigate and resolve my complaint. I consent to being contacted regarding this matter and accept the AEGA terms outlined in the Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                disabled={!formData.termsAccepted}
                className="w-full bg-[#F58A07] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#e07b06] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 md:w-auto"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
