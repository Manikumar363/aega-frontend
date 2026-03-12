"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import AgentManagementHome from "@/components/Agency/agentManagement/home"


export default function AgentManagementPage() {
	return (
		<DashboardLayout role="agent">
            <AgentManagementHome />
		</DashboardLayout>
	);
}
