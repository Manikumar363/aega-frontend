"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";

import StudentManagementHome from "@/components/Agency/studentManagement/home";


export default function AgentManagementPage() {
	return (
		<DashboardLayout role="agent">
            <StudentManagementHome />
		</DashboardLayout>
	);
}
