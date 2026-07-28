// src/components/auth/AgentDocumentsForm.tsx
"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signup, storeAuthToken } from "@/lib/api/authService";
import { uploadFile } from "@/lib/api/fileService";
import { AgentSignupRequest } from "@/lib/api/types";
import Captcha from "./Captcha";

interface AgentFormData {
  businessType: "b2b" | "b2c";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AgentDocumentsFormProps {
  formData: AgentFormData;
  onBack?: () => void;
}

export default function AgentDocumentsForm({ formData, onBack }: AgentDocumentsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ doc1: File | null; doc2: File | null }>({
    doc1: null,
    doc2: null,
  });
  const [uploadProgress, setUploadProgress] = useState({
    doc1: false,
    doc2: false,
  });
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docNum: "doc1" | "doc2") => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        return;
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [docNum]: file,
      }));
      toast.success(`File ${docNum === "doc1" ? "1" : "2"} selected`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, docNum: "doc1" | "doc2") => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        return;
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [docNum]: file,
      }));
      toast.success(`File ${docNum === "doc1" ? "1" : "2"} selected`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Captcha
    if (captchaInput.trim().toUpperCase() !== captchaCode.trim().toUpperCase()) {
      toast.error("Invalid Captcha code. Please try again.");
      setCaptchaInput("");
      return;
    }

    // Validate files
    if (!uploadedFiles.doc1 || !uploadedFiles.doc2) {
      toast.error("Please upload both documents");
      return;
    }

    // Capture files to avoid stale closure
    const doc1 = uploadedFiles.doc1;
    const doc2 = uploadedFiles.doc2;

    const uploadAndSignup = async () => {
      try {
        console.log("📋 Starting upload process with files:", {
          doc1: doc1.name,
          doc2: doc2.name,
        });

        // Upload first document
        setUploadProgress({ doc1: true, doc2: false });
        const doc1Path = await uploadFile(doc1);
        console.log("✅ Document 1 uploaded:", doc1Path);

        // Upload second document
        setUploadProgress({ doc1: false, doc2: true });
        const doc2Path = await uploadFile(doc2);
        console.log("✅ Document 2 uploaded:", doc2Path);

        setUploadProgress({ doc1: false, doc2: false });
        console.log("✅ Both documents uploaded successfully");

        // Prepare signup data
        const signupData: AgentSignupRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: "agent",
          businessType: formData.businessType,
          supportingDocument1: doc1Path,
          supportingDocument2: doc2Path,
        };

        console.log("📝 Signup data prepared:", signupData);

        // Call signup API
        const response = await signup(signupData);
        console.log("✅ Signup successful:", response);

        // Store auth token
        storeAuthToken(response.token);

        // Redirect after a brief delay to role-based login route!
        setTimeout(() => {
          router.push("/login?role=agent");
        }, 1000);

        return "Account created successfully!";
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Signup failed";
        console.error("🔴 Signup error:", errorMessage);
        console.error("Full error:", error);
        throw new Error(errorMessage);
      }
    };

    setIsLoading(true);
    try {
      await toast.promise(uploadAndSignup(), {
        loading: "Setting up your account...",
        success: "Account created successfully!",
        error: (err) => `${err.message}`,
      });
    } catch (error) {
      // Error already handled by toast.promise
      console.error("Toast promise error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            1
          </div>
          <span className="text-xs text-white/60 hover:text-[#F58A07] underline">Provide your Basic Details</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F58A07] text-sm font-bold text-white">
            2
          </div>
          <span className="text-xs text-[#F58A07]">Upload your Documents</span>
        </div>
      </div>

      {/* Document 1 */}
      <div>
        <label className="mb-2 block text-xs text-white/70">Supporting Document 1*</label>
        <div
          onClick={() => !isLoading && fileInputRef1.current?.click()}
          onDragOver={handleDragOver}
          onDrop={(e) => !isLoading && handleDrop(e, "doc1")}
          className="flex h-40 cursor-pointer flex-col items-center justify-center border border-dashed border-white/30 bg-[#0E1B30] hover:bg-[#13243F]"
        >
          <Upload className="mb-2 h-8 w-8 text-white/55" />
          <span className="text-sm text-white/80">
            {uploadedFiles.doc1 ? uploadedFiles.doc1.name : "Choose file or drag & drop here"}
          </span>
          <p className="mt-1 text-xs text-white/40">
            {uploadedFiles.doc1
              ? "File selected"
              : "Business license, registration proof (PDF, JPG, PNG - max 10MB)"}
          </p>
          <input
            ref={fileInputRef1}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileSelect(e, "doc1")}
          />
        </div>
      </div>

      {/* Document 2 */}
      <div>
        <label className="mb-2 block text-xs text-white/70">Supporting Document 2*</label>
        <div
          onClick={() => !isLoading && fileInputRef2.current?.click()}
          onDragOver={handleDragOver}
          onDrop={(e) => !isLoading && handleDrop(e, "doc2")}
          className="flex h-40 cursor-pointer flex-col items-center justify-center border border-dashed border-white/30 bg-[#0E1B30] hover:bg-[#13243F]"
        >
          <Upload className="mb-2 h-8 w-8 text-white/55" />
          <span className="text-sm text-white/80">
            {uploadedFiles.doc2 ? uploadedFiles.doc2.name : "Choose file or drag & drop here"}
          </span>
          <p className="mt-1 text-xs text-white/40">
            {uploadedFiles.doc2
              ? "File selected"
              : "Emails, documents, screenshots (PDF, JPG, PNG - max 10MB each)"}
          </p>
          <input
            ref={fileInputRef2}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileSelect(e, "doc2")}
          />
        </div>
      </div>

      {/* Captcha */}
      <Captcha
        onChange={setCaptchaCode}
        onUserInputChange={setCaptchaInput}
        userInput={captchaInput}
      />

      {/* Sign Up Button */}
      <div className="text-left">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#F58A07] px-12 py-4 text-sm font-bold uppercase text-white hover:bg-[#e07b06] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "SIGNING UP..." : "SIGN UP"}
        </button>
      </div>
    </form>
  );
}
