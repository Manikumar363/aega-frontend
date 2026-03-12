import DashboardLayout from "@/components/ui/dashboard-layout";
import OfficeManagementHome from "@/components/Agency/officeManagement/home";

export default function OfficePage() {
	return (
		<DashboardLayout role="agent">
			<OfficeManagementHome />
		</DashboardLayout>
	);
}
