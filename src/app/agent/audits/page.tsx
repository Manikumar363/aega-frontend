"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import Audits from "@/components/agentManagement/audits";

export default function AgentAuditsPage() {
  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        <h1 className="text-white font-medium text-3xl mb-4">My Audits</h1>
        <Audits />
      </div>
    </DashboardLayout>
  );
}