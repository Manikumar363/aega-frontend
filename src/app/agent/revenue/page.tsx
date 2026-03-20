"use client";

import RevenueManagementHome from "@/components/Agency/RevenueManagement/home";
import DashboardLayout from "@/components/ui/dashboard-layout";

export default function OfficePage() {
	return (
		<DashboardLayout role="agent">
			<RevenueManagementHome />
		</DashboardLayout>
	);
}
