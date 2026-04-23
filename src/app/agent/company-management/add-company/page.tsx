"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import AddCompany from "@/components/Agency/companyManagement/addCompany";

export default function AddCompanyPage() {
  return (
    <DashboardLayout role="agent">
      <AddCompany />
    </DashboardLayout>
  );
}