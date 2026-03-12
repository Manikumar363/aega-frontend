"use client";

import UniManagementHome from "@/components/Agency/uniManagement/home";
import DashboardLayout from "@/components/ui/dashboard-layout";

export default function OfficePage() {
	return (
		<DashboardLayout role="agent">
			<UniManagementHome />
		</DashboardLayout>
	);
}
