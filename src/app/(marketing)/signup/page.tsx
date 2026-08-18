// src/app/(marketing)/signup/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SignUpLayout from "@/components/auth/SignUpLayout";
import AgentBasicForm from "@/components/auth/AgentBasicForm";
import AgentDocumentsForm from "@/components/auth/AgentDocumentsForm";
import UniversityBasicForm from "@/components/auth/UniversityBasicForm";
import UniversityDocumentsForm from "@/components/auth/UniversityDocumentsForm";

interface AgentFormData {
  businessType: "b2b" | "b2c";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UniversityFormData {
  universityName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function SignUpContent() {
  const [userType, setUserType] = useState<"agent" | "university">("agent");
  const [step, setStep] = useState<"basic" | "documents">("basic");
  const [agentFiles, setAgentFiles] = useState<{ doc1: File | null; doc2: File | null }>({
    doc1: null,
    doc2: null,
  });
  const [universityFiles, setUniversityFiles] = useState<{ doc1: File | null; doc2: File | null }>({
    doc1: null,
    doc2: null,
  });
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [agentData, setAgentData] = useState<AgentFormData>({
    businessType: "b2b",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [universityData, setUniversityData] = useState<UniversityFormData>({
    universityName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    document.title = "AEGA - Sign Up";
    if (roleParam === "university" || roleParam === "agent") {
      setUserType(roleParam);
      setStep("basic");
    }
  }, [roleParam]);

  const handleUserTypeToggle = (type: "agent" | "university") => {
    setUserType(type);
    setStep("basic");
    
    // Clear all previously prefilled details on toggle!
    setAgentData({
      businessType: "b2b",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setUniversityData({
      universityName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAgentFiles({ doc1: null, doc2: null });
    setUniversityFiles({ doc1: null, doc2: null });
  };

  const renderForm = () => {
    if (userType === "agent") {
      return step === "basic" ? (
        <AgentBasicForm
          formData={agentData}
          setFormData={setAgentData}
          onNext={() => setStep("documents")}
        />
      ) : (
        <AgentDocumentsForm formData={agentData} onBack={() => setStep("basic")} uploadedFiles={agentFiles} setUploadedFiles={setAgentFiles} />
      );
    } else {
      return step === "basic" ? (
        <UniversityBasicForm
          formData={universityData}
          setFormData={setUniversityData}
          onNext={() => setStep("documents")}
        />
      ) : (
        <UniversityDocumentsForm formData={universityData} onBack={() => setStep("basic")} uploadedFiles={universityFiles} setUploadedFiles={setUniversityFiles} />
      );
    }
  };

  return (
    <SignUpLayout userType={userType} onToggle={handleUserTypeToggle}>
      {renderForm()}
    </SignUpLayout>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen w-full bg-[#0A1628] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
