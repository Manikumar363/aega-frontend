// src/app/(auth)/sign-up/page.tsx
"use client";

import { useState } from "react";
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [userType, setUserType] = useState<"agent" | "university">("agent");
  const [step, setStep] = useState<"basic" | "documents">("basic");
  
  const [agentData, setAgentData] = useState<AgentFormData>({
    businessType: "b2b",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [universityData, setUniversityData] = useState<UniversityFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleUserTypeToggle = (type: "agent" | "university") => {
    setUserType(type);
    setStep("basic"); // Reset to basic step when toggling user type
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
        <AgentDocumentsForm formData={agentData} />
      );
    } else {
      return step === "basic" ? (
        <UniversityBasicForm
          formData={universityData}
          setFormData={setUniversityData}
          onNext={() => setStep("documents")}
        />
      ) : (
        <UniversityDocumentsForm formData={universityData} />
      );
    }
  };

  return (
    <SignUpLayout userType={userType} onToggle={handleUserTypeToggle}>
      {renderForm()}
    </SignUpLayout>
  );
}
