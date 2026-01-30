// src/app/(auth)/sign-up/page.tsx
"use client";

import { useState } from "react";
import SignUpLayout from "@/components/auth/SignUpLayout";
import AgentBasicForm from "@/components/auth/AgentBasicForm";
import AgentDocumentsForm from "@/components/auth/AgentDocumentsForm";
import UniversityBasicForm from "@/components/auth/UniversityBasicForm";
import UniversityDocumentsForm from "@/components/auth/UniversityDocumentsForm";

export default function SignUpPage() {
  const [userType, setUserType] = useState<"agent" | "university">("agent");
  const [step, setStep] = useState<"basic" | "documents">("basic");

  const renderForm = () => {
    if (userType === "agent") {
      return step === "basic" ? (
        <AgentBasicForm onNext={() => setStep("documents")} />
      ) : (
        <AgentDocumentsForm />
      );
    } else {
      return step === "basic" ? (
        <UniversityBasicForm onNext={() => setStep("documents")} />
      ) : (
        <UniversityDocumentsForm />
      );
    }
  };

  return (
    <SignUpLayout userType={userType} onToggle={setUserType}>
      {renderForm()}
    </SignUpLayout>
  );
}
