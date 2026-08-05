import React, { useState, useEffect } from "react";
import { ShieldAlert, Calendar, Loader2 } from "lucide-react";

interface AuditsProps {
  targetId?: string;
  targetType?: "agent" | "company" | "university";
}

interface AuditSummary {
  complianceScore: number;
  numberOfAudits: number;
  activeAlerts: number;
  riskLevel: string;
}

interface AuditCheck {
  _id: string;
  categoryId: string;
  categoryName: string;
  complianceScore: number;
  auditedBy?: {
    name: string;
    email: string;
    role: string;
  } | string;
  createdAt: string;
  answers: {
    status: string;
    severity: string;
    comment?: string;
    verificationNote?: string;
  }[];
}

const Audits: React.FC<AuditsProps> = ({ targetId, targetType }) => {
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [completedChecks, setCompletedChecks] = useState<AuditCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) return;

        // Build query string
        const queryParams = new URLSearchParams();
        if (targetType) queryParams.append("targetType", targetType);
        if (targetId) queryParams.append("targetId", targetId);
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        // 1. Fetch Summary KPIs
        const summaryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/audits/checks/summary${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let summaryData = null;
        if (summaryRes.ok) {
          const res = await summaryRes.json();
          if (res.success) summaryData = res.data;
        }

        // 2. Fetch Checks list
        const checksRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/audits/checks/list${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let checksData: AuditCheck[] = [];
        if (checksRes.ok) {
          const res = await checksRes.json();
          if (res.success) checksData = res.data;
        }

        setSummary(summaryData);
        setCompletedChecks(checksData);
      } catch (err: any) {
        console.error("Error fetching audits:", err);
        setError("Failed to load audit data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditsData();
  }, [targetId, targetType]);

  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "text-red-400";
      case "MEDIUM":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#F68E2D]" />
        <span className="ml-3 text-sm text-white/70">Loading audit log...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded text-sm text-center">
        {error}
      </div>
    );
  }

  // Partition audits into Latest and Previous groups (matching Admin panel structure)
  const latestChecks: AuditCheck[] = [];
  const previousChecks: AuditCheck[] = [];
  const seenCategories = new Set<string>();

  completedChecks.forEach((check) => {
    const catKey = check.categoryId ? String(check.categoryId) : check.categoryName;
    if (!seenCategories.has(catKey)) {
      seenCategories.add(catKey);
      latestChecks.push(check);
    } else {
      previousChecks.push(check);
    }
  });

  const renderAuditCard = (item: AuditCheck, isLatest: boolean = false) => {
    const issuesCount = item.answers?.filter((a) => a.status === "non-compliant").length ?? 0;
    const commentsList = item.answers?.map((a: any) => a.comment || a.verificationNote || a.note).filter(Boolean) || [];

    return (
      <div
        key={item._id}
        className="bg-[#14123A] border border-[#3A3760] p-5 flex flex-col justify-between min-h-[160px] hover:border-[#F68E2D]/40 transition-all rounded space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase leading-tight">
              {item.categoryName}
            </h4>
            <span className="text-xs text-white/50 block mt-1">
              Audited by: {typeof item.auditedBy === "object" ? item.auditedBy.name : "System Admin"}
            </span>
          </div>
          {isLatest && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F68E2D]/20 text-[#F68E2D] border border-[#F68E2D]/30">
              Latest
            </span>
          )}
        </div>

        {/* Centered Status Badge in Middle */}
        <div className="my-2 flex items-center justify-center text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 shadow-sm">
            <span>{item.complianceScore.toFixed(2)}% Score</span>
          </div>
        </div>

        {/* Admin Comments / Verification Notes */}
        {commentsList.length > 0 ? (
          <div className="bg-[#1A163E] border border-[#383B63] p-2.5 rounded text-xs text-white/80">
            <span className="font-semibold text-[#F68E2D] block mb-1">Admin Verification Notes / Comments:</span>
            <p className="whitespace-pre-line text-white/75">{commentsList.join(" | ")}</p>
          </div>
        ) : null}

        <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-[#3A3760]/30">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-white/40" />
            <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          <span className="text-[11px] text-[#F68E2D] font-medium">
            {issuesCount} {issuesCount === 1 ? "Issue" : "Issues"} Flagged
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-[#3A3760] bg-[#14123A] divide-y md:divide-y-0 md:divide-x divide-[#3A3760]">
        {/* Overall Score */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ShieldAlert className="w-5 h-5 text-[#F68E2D]" />
            <span className="font-bold text-base text-[#F68E2D]">
              {summary ? `${summary.complianceScore.toFixed(2)}%` : "100.00%"}
            </span>
          </div>
          <span className="text-white/70 text-sm">Overall Score</span>
        </div>

        {/* Total Audits */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ShieldAlert className="w-5 h-5 text-[#F68E2D]" />
            <span className="font-bold text-base text-[#F68E2D]">
              {summary?.numberOfAudits ?? 0}
            </span>
          </div>
          <span className="text-white/70 text-sm">No. of Audits</span>
        </div>

        {/* Active Issues */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ShieldAlert className="w-5 h-5 text-[#F68E2D]" />
            <span className="font-bold text-base text-[#F68E2D]">
              {summary?.activeAlerts ?? 0}
            </span>
          </div>
          <span className="text-white/70 text-sm">Active Issues</span>
        </div>

        {/* Risk Level */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ShieldAlert className="w-5 h-5 text-[#F68E2D]" />
            <span className={`font-bold text-base uppercase ${getRiskColor(summary?.riskLevel ?? "LOW")}`}>
              {summary?.riskLevel ?? "LOW"}
            </span>
          </div>
          <span className="text-white/70 text-sm">Risk Level</span>
        </div>
      </div>

      {/* Completed History sections */}
      <div className="space-y-8">
        {/* 1. Latest Audits */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-white/50 uppercase">
            1. Latest Audits ({latestChecks.length})
          </h3>

          {latestChecks.length === 0 ? (
            <div className="text-center py-12 text-white/50 border border-[#3A3760] bg-[#14123A] rounded">
              No compliance audits recorded for this profile.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestChecks.map((item) => renderAuditCard(item, true))}
            </div>
          )}
        </div>

        {/* 2. Previous Audits History */}
        {previousChecks.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#3A3760]/50">
            <h3 className="text-sm font-semibold tracking-wider text-white/50 uppercase">
              2. Previous Audits History ({previousChecks.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previousChecks.map((item) => renderAuditCard(item, false))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Audits;
