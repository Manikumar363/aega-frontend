"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import Audits from "@/components/agentManagement/audits";

export default function UniversityAuditsPage() {
  return (
    <DashboardLayout role="university">
      <div className="space-y-6">
        <h1 className="text-white font-medium text-3xl mb-4">University Audits</h1>
        <Audits />
      </div>
    </DashboardLayout>
  );
}