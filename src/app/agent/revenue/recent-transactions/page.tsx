"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import RecentTransactions from "@/components/Agency/RevenueManagement/recentTransactions";

export default function AgentRecentTransactionsPage() {
  return (
    <DashboardLayout role="agent">
      <RecentTransactions />
    </DashboardLayout>
  );
}
