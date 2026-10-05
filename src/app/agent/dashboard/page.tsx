"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { ComplianceIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredUserData, getAuthToken } from "@/lib/api";

export default function AgentDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Agent");
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    overallScore: null as number | null,
    numberOfAudits: 0,
    activeIssues: 0,
    riskLevel: "N/A",
    completedCdpHours: 0,
    targetCdpHours: 120
  });

  const [complianceDistribution, setComplianceDistribution] = useState([
    { name: "Agent Compliance", score: 0, color: "#10B981" },
    { name: "University Compliance", score: 0, color: "#F59E0B" },
    { name: "UKVI Compliance", score: 0, color: "#3B82F6" },
    { name: "Rules & Regulations", score: 0, color: "#8B5CF6" },
  ]);

  const [revenueDistribution, setRevenueDistribution] = useState([
    { label: "Total Revenue", value: "£0 GBP", progress: 0, color: "#10B981" },
    { label: "Pro Tier Revenue", value: "£0 GBP", progress: 0, color: "#3B82F6" },
    { label: "Elements Tier Revenue", value: "£0 GBP", progress: 0, color: "#F59E0B" },
    { label: "Active Subscriptions", value: "0 Subscriptions", progress: 0, color: "#8B5CF6" },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getAuthToken();
    const storedUser = getStoredUserData();

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const u = storedUser as any;
    const fullName = u?.fullName || `${u?.firstName || ''} ${u?.lastName || ''}`.trim() || u?.name || "Agent";
    setUserName(fullName);

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch live user compliance summary & audit data
        const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/compliance-indicators/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let userAuditsCount = 0;
        let userOverallScore: number | null = null;

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.success && summaryData.data) {
            userAuditsCount = summaryData.data.numberOfAudits ?? 0;
            userOverallScore = userAuditsCount > 0 ? (summaryData.data.overallScore ?? null) : null;
            setSummary({
              overallScore: userOverallScore,
              numberOfAudits: userAuditsCount,
              activeIssues: summaryData.data.activeIssues ?? 0,
              riskLevel: userAuditsCount > 0 ? (summaryData.data.riskLevel || "LOW") : "N/A",
              completedCdpHours: summaryData.data.completedCdpHours ?? 0,
              targetCdpHours: summaryData.data.targetCdpHours ?? 120
            });

            // Dynamic Compliance Distribution (0% for newly created accounts, dynamic upon audit completion)
            if (userAuditsCount > 0 && userOverallScore !== null) {
              const score = Math.round(userOverallScore);
              setComplianceDistribution([
                { name: "Agent Compliance", score: score, color: "#10B981" },
                { name: "University Compliance", score: Math.min(100, Math.round(score * 0.95)), color: "#F59E0B" },
                { name: "UKVI Compliance", score: Math.max(0, Math.round(score * 0.9)), color: "#3B82F6" },
                { name: "Rules & Regulations", score: score, color: "#8B5CF6" },
              ]);
            } else {
              setComplianceDistribution([
                { name: "Agent Compliance", score: 0, color: "#10B981" },
                { name: "University Compliance", score: 0, color: "#F59E0B" },
                { name: "UKVI Compliance", score: 0, color: "#3B82F6" },
                { name: "Rules & Regulations", score: 0, color: "#8B5CF6" },
              ]);
            }
          }
        }

        // 2. Fetch live subscription/revenue details for current user
        try {
          const subRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscription/subscription-status`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (subRes.ok) {
            const subData = await subRes.json();
            const sub = subData.subscription;
            if (sub && sub.status === "active") {
              const paid = Number(sub.amountPaidGbp) || 0;
              const isPro = sub.planName === "Pro";
              const isElements = sub.planName === "Elements";

              setRevenueDistribution([
                { label: "Total Revenue", value: `£${paid} GBP`, progress: Math.min(100, Math.round((paid / 500) * 100)), color: "#10B981" },
                { label: "Pro Tier Revenue", value: isPro ? `£${paid} GBP` : "£0 GBP", progress: isPro ? 100 : 0, color: "#3B82F6" },
                { label: "Elements Tier Revenue", value: isElements ? `£${paid} GBP` : "£0 GBP", progress: isElements ? 100 : 0, color: "#F59E0B" },
                { label: "Active Subscriptions", value: "1 Active", progress: 100, color: "#8B5CF6" },
              ]);
            } else {
              setRevenueDistribution([
                { label: "Total Revenue", value: "£0 GBP", progress: 0, color: "#10B981" },
                { label: "Pro Tier Revenue", value: "£0 GBP", progress: 0, color: "#3B82F6" },
                { label: "Elements Tier Revenue", value: "£0 GBP", progress: 0, color: "#F59E0B" },
                { label: "Active Subscriptions", value: "0 Subscriptions", progress: 0, color: "#8B5CF6" },
              ]);
            }
          }
        } catch (subErr) {
          console.error("Subscription fetch error:", subErr);
        }

        // 3. Dynamic total available CDP hours calculation
        try {
          const cdpRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cdp-courses`);
          if (cdpRes.ok) {
            const cdpCourses = await cdpRes.json();
            if (Array.isArray(cdpCourses) && cdpCourses.length > 0) {
              const totalHours = cdpCourses.reduce((sum: number, c: any) => sum + (Number(c.timeInHr) || 1), 0);
              if (totalHours > 0) {
                setSummary(prev => ({ ...prev, targetCdpHours: totalHours }));
              }
            }
          }
        } catch (cdpErr) {
          console.error("CDP courses fetch error:", cdpErr);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const hasScore = summary.numberOfAudits > 0 && summary.overallScore !== null;
  const scoreDisplay = hasScore ? `${summary.overallScore}%` : "N/A";
  const riskDisplay = summary.numberOfAudits > 0 ? summary.riskLevel : "N/A";

  const statsData = [
    { icon: <ComplianceIcon />, label: "Compliance Score", value: scoreDisplay, color: "#F68E2D", href: "/agent/compliances" },
    { icon: <ComplianceIcon />, label: "CDP Hours", value: `${summary.completedCdpHours}/${summary.targetCdpHours}`, color: "#F68E2D", href: "/agent/CDP" },
    { icon: <ComplianceIcon />, label: "Active Issues", value: String(summary.activeIssues), color: "#F68E2D", href: "/agent/compliances" },
    { icon: <ComplianceIcon />, label: "No. of Audits", value: String(summary.numberOfAudits), color: "#F68E2D", href: "/agent/audits" },
    { icon: <ComplianceIcon />, label: "Overall Score", value: scoreDisplay, color: "#F68E2D", href: "/agent/compliances" },
    {
      icon: <ComplianceIcon />,
      label: "Risk Level",
      value: riskDisplay,
      color: riskDisplay === 'HIGH' ? '#EF4444' : riskDisplay === 'MEDIUM' ? '#F59E0B' : riskDisplay === 'LOW' ? '#10B981' : '#9CA3AF',
      href: "/agent/compliances"
    },
  ];

  return (
    <DashboardLayout role="agent">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Hi, {userName}</h1>
          <p className="text-white/60 text-sm">
            Overview of platform activity, performance, and highlights.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className="bg-[#14112E] border border-gray-800 rounded-lg p-6 flex items-center justify-between hover:border-[#F68E2D]/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-2xl text-[#F68E2D] shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-white/90 text-base font-semibold">{stat.label}</p>
                </div>
              </div>
              <div>
                <p
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Distributions Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliances Distribution */}
          <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">Compliances Distribution</h2>
            <div className="space-y-4">
              {complianceDistribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-350">{item.name}</span>
                    <span className="font-semibold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">Revenue Distribution</h2>
            <div className="space-y-4">
              {revenueDistribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-350">{item.label}</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}