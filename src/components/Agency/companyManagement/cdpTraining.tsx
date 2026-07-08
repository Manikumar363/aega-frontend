"use client";

import React, { useEffect, useState } from "react";

interface CDPTrainingProps {
  targetId?: string;
  targetType?: "agent" | "company" | "university";
}

interface CdpProgressItem {
  _id: string;
  status: "on-going" | "completed" | "due";
  dueDate?: string;
  notes?: string;
  certificateUrl?: string;
  courseId: {
    _id: string;
    courseName: string;
    modules: number;
    timeInHr: number;
    description?: string;
  };
}

export default function CDPTraining({ targetId, targetType }: CDPTrainingProps) {
  const [progressList, setProgressList] = useState<CdpProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCdpProgress = async () => {
      if (!targetId || !targetType) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/cdp-courses/enrolled?targetType=${targetType}&targetId=${targetId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const resData = await res.json();
          if (resData.success) {
            setProgressList(resData.data || []);
          }
        }
      } catch (err) {
        console.error("Error loading CDP progress:", err);
        setError("Failed to load CDP progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchCdpProgress();
  }, [targetId, targetType]);

  const stats = React.useMemo(() => {
    const total = progressList.reduce((sum, item) => sum + (item.courseId?.timeInHr || 0), 0);
    const completed = progressList
      .filter((item) => item.status === "completed")
      .reduce((sum, item) => sum + (item.courseId?.timeInHr || 0), 0);
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, percentage };
  }, [progressList]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-lime-100 text-lime-700 border border-lime-200";
      case "due":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-sky-100 text-sky-700 border border-sky-200";
    }
  };

  const getStatusBulletClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-lime-600";
      case "due":
        return "bg-rose-600";
      default:
        return "bg-sky-600";
    }
  };

  const handleViewCertificate = (url?: string) => {
    if (!url) return;
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <div className="text-white/60 text-sm">Loading CDP progress...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* KPI stats card */}
      <div className="bg-[#14112E] rounded-lg p-5 border border-[#2C2A45]">
        <div className="text-white font-semibold text-xl mb-1">CDP PROGRESS</div>
        <div className="text-white/70 text-sm mb-3">Overall Completion Hours</div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-[#F68E2D] rounded-full transition-all duration-300" style={{ width: `${stats.percentage}%` }} />
        </div>
        <div className="text-right text-white font-semibold">{stats.completed}/{stats.total} hrs ({stats.percentage}%)</div>
      </div>

      {progressList.length === 0 ? (
        <div className="border border-gray-800 p-8 text-center rounded-lg bg-[#14112E] text-white/55">
          No enrolled courses found for this profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressList.map((item) => (
            <div key={item._id} className="bg-[#07123A] border border-[#2C2A45] rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-white font-semibold text-base line-clamp-1">{item.courseId?.courseName}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(item.status)}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${getStatusBulletClass(item.status)}`} />
                    {item.status.replace("-", " ")}
                  </span>
                </div>
                <div className="text-white/80 text-sm mb-2">Module {item.courseId?.modules}</div>
                <div className="flex items-center gap-4 text-white/60 text-xs mb-4">
                  <span>◷ {item.courseId?.timeInHr} hours</span>
                  {item.dueDate && <span>📅 Due: {new Date(item.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>

              {item.status === "completed" && item.certificateUrl && (
                <button
                  type="button"
                  onClick={() => handleViewCertificate(item.certificateUrl)}
                  className="ml-auto bg-[#201B48] hover:bg-[#2e2768] border border-[#2C2A45] text-white text-xs px-4 py-2 rounded transition-colors"
                >
                  View Certificate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}