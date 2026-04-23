"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import CompanyManagementHome from "@/components/Agency/companyManagement/home";

export default function CompanyManagementPage() {
  return (
    <DashboardLayout role="agent">
      <CompanyManagementHome />
    </DashboardLayout>
  );
}