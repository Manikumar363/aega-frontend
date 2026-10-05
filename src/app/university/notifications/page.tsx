"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Bell, AlertTriangle, ShieldCheck, FileText, Trash2, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "audit" | "compliance" | "cdp" | "system";
  isRead: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Account Created Successfully",
    message: "Welcome to AEGA Alliance! Your University account setup is complete.",
    timestamp: "Just now",
    type: "system",
    isRead: false,
  },
  {
    id: "2",
    title: "New CDP Training Available",
    message: "A new mandatory CDP module on UKVI Compliance Guidelines has been assigned to your portal.",
    timestamp: "2 hours ago",
    type: "cdp",
    isRead: false,
  },
  {
    id: "3",
    title: "Annual Audit Schedule Updated",
    message: "Your upcoming audit assessment date has been scheduled for next month. Please review required documents.",
    timestamp: "1 day ago",
    type: "audit",
    isRead: true,
  },
  {
    id: "4",
    title: "Compliance Verification Pending",
    message: "Please complete your pending supporting document uploads to finalize full compliance certification.",
    timestamp: "3 days ago",
    type: "compliance",
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "audit" | "system">("all");

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead;
    if (activeTab === "audit") return item.type === "audit" || item.type === "compliance";
    if (activeTab === "system") return item.type === "system" || item.type === "cdp";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "audit":
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case "compliance":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "cdp":
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-[#F68E2D]" />;
    }
  };

  const getTypeBadge = (type: NotificationItem["type"]) => {
    switch (type) {
      case "audit":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-semibold uppercase">Audit</span>;
      case "compliance":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-semibold uppercase">Compliance</span>;
      case "cdp":
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded font-semibold uppercase">CDP Training</span>;
      default:
        return <span className="bg-[#F68E2D]/10 text-[#F68E2D] border border-[#F68E2D]/20 text-[10px] px-2 py-0.5 rounded font-semibold uppercase">System</span>;
    }
  };

  return (
    <DashboardLayout role="university">
      <div className="space-y-6 max-w-5xl mx-auto text-left">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-[#F68E2D] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 mt-1">
              Stay updated with your account activity, audit alerts, and system notices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#F68E2D]" />
                  Mark all read
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-white/10 space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "border-[#F68E2D] text-[#F68E2D]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "unread"
                ? "border-[#F68E2D] text-[#F68E2D]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "audit"
                ? "border-[#F68E2D] text-[#F68E2D]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Audits & Compliance
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "system"
                ? "border-[#F68E2D] text-[#F68E2D]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            System & Training
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => toggleReadStatus(notif.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  notif.isRead
                    ? "bg-[#14112E]/60 border-white/5 opacity-75 hover:opacity-100"
                    : "bg-[#14112E] border-white/20 shadow-lg hover:border-[#F68E2D]/50"
                }`}
              >
                <div className="p-2.5 rounded-lg bg-white/5 shrink-0 mt-0.5">
                  {getTypeIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm text-white truncate ${!notif.isRead ? "font-bold" : "font-medium opacity-80"}`}>
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#F68E2D] shrink-0 animate-pulse" />
                      )}
                    </div>
                    {getTypeBadge(notif.type)}
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed mb-2">
                    {notif.message}
                  </p>

                  <span className="text-[10px] text-white/40 font-mono">
                    {notif.timestamp}
                  </span>
                </div>

                <button
                  onClick={(e) => deleteNotification(notif.id, e)}
                  className="p-1 text-white/40 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                  title="Remove notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="bg-[#14112E] border border-white/10 rounded-xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/40">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">No notifications found</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                You're all caught up! There are no notifications to display under this filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
