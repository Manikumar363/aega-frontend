"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Eye,
  Check,
  X,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import LeaveRequestModal from "@/components/Agency/LeaveManagement/LeaveRequestModal";

const PAGE_SIZE = 8;

interface LeaveRequest {
  id: string;
  name: string;
  designation: string;
  image?: string | null;
  startDate: string;
  endDate: string;
  leaveType: string;
  title: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface ApiLeaveResponse {
  _id: string;
  counsellorId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    businessType?: string;
  } | string;
  ownerAgentId?: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  title: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLeaveId, setDeleteLeaveId] = useState<string | null>(null);
  const [deleteLeaveName, setDeleteLeaveName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Leave Form States (for Counsellors)
  const [isCreating, setIsCreating] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Get current user role and info
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const isCounsellor = userRole === "counsellor";

  const getLoggedInUserName = () => {
    if (typeof window === "undefined") return "Me";
    try {
      const data = localStorage.getItem("userData");
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.name || `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || "Counsellor";
      }
    } catch (e) {
      console.error(e);
    }
    return "Counsellor";
  };

  // Fetch leave requests
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      const endpoint = isCounsellor ? "/api/leaves/me" : "/api/leaves/team";
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch leaves: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedData: ApiLeaveResponse[] = Array.isArray(data)
        ? data
        : data.leaves || data.data || [];

      const transformedLeaves = parsedData.map((leave: ApiLeaveResponse) => {
        let name = "Counsellor";
        if (isCounsellor) {
          name = getLoggedInUserName();
        } else if (leave.counsellorId && typeof leave.counsellorId === "object") {
          name = leave.counsellorId.name;
        }

        let mappedStatus: "Pending" | "Approved" | "Rejected" = "Pending";
        if (leave.status === "accepted") mappedStatus = "Approved";
        if (leave.status === "rejected") mappedStatus = "Rejected";

        return {
          id: leave._id,
          name,
          designation: "Counsellor",
          image: null,
          startDate: leave.startDate,
          endDate: leave.endDate,
          leaveType: leave.leaveType,
          title: leave.title,
          reason: leave.reason,
          status: mappedStatus,
        };
      });

      setLeaves(transformedLeaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  }, [isCounsellor]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Filter leaves by search
  const filtered = useMemo(() => {
    return leaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(search.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(search.toLowerCase()) ||
        leave.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaves, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  const pageNumbers: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1, 2, 3, "...", totalPages);
  }

  // Handle submit leave request form (Counsellor only)
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate || !title || !reason) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmittingForm(true);
      const token = localStorage.getItem("authToken");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          title,
          reason,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit leave request.");
      }

      toast.success("Leave request submitted successfully!");
      setIsCreating(false);
      // Reset form
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setTitle("");
      setReason("");
      fetchLeaves();
    } catch (error: any) {
      console.error("Error submitting leave request:", error);
      toast.error(error.message || "Failed to submit leave request.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handle approve leave request (Agent/Owner only)
  const handleApprove = async () => {
    if (!selectedLeave) return;

    try {
      setIsApproving(true);
      const token = localStorage.getItem("authToken");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/${selectedLeave.id}/accept`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.error || "Failed to approve leave request");
      }

      toast.success(`Leave request for ${selectedLeave.name} approved`);
      setShowModal(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error: any) {
      console.error("Error approving leave:", error);
      toast.error(error.message || "Failed to approve leave request");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle reject leave request (Agent/Owner only)
  const handleReject = async () => {
    if (!selectedLeave) return;

    try {
      setIsRejecting(true);
      const token = localStorage.getItem("authToken");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/${selectedLeave.id}/reject`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.error || "Failed to reject leave request");
      }

      toast.success(`Leave request for ${selectedLeave.name} rejected`);
      setShowModal(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error: any) {
      console.error("Error rejecting leave:", error);
      toast.error(error.message || "Failed to reject leave request");
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle delete leave request
  const handleDeleteLeave = async () => {
    if (!deleteLeaveId) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authToken");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/${deleteLeaveId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.error || "Failed to delete leave request");
      }

      toast.success(`Leave request deleted`);
      setDeleteDialogOpen(false);
      setDeleteLeaveId(null);
      setDeleteLeaveName("");
      fetchLeaves();
    } catch (error: any) {
      console.error("Error deleting leave:", error);
      toast.error(error.message || "Failed to delete leave request");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle view leave details
  const handleViewLeave = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (leave: LeaveRequest) => {
    setDeleteLeaveId(leave.id);
    setDeleteLeaveName(leave.name);
    setDeleteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Get status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
      case "Approved":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border border-gray-500/20";
    }
  };

  // Get avatar placeholder color
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // 1. Render Leave Request Form (Counsellor only)
  if (isCreating) {
    return (
      <div className="space-y-6 text-white animate-fadeIn">
        <h1 className="text-white text-3xl font-semibold leading-tight">Leave Request</h1>
        <form onSubmit={handleSubmitRequest} className="space-y-6 max-w-4xl bg-[#14123A] border border-[#2E325D] p-6 sm:p-8 rounded-lg">
          
          {/* Leave Type */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-semibold">
              Leave Type <span className="text-[#ED3941]">*</span>
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full bg-[#0F0D2B] text-white border border-[#2D2A50] rounded px-4 py-3 outline-none focus:border-[#F68E2D] transition-colors"
            >
              <option value="">Type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-white text-sm font-semibold">
                Start Date <span className="text-[#ED3941]">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0F0D2B] text-white border border-[#2D2A50] rounded px-4 py-3 outline-none focus:border-[#F68E2D] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-white text-sm font-semibold">
                End Date <span className="text-[#ED3941]">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#0F0D2B] text-white border border-[#2D2A50] rounded px-4 py-3 outline-none focus:border-[#F68E2D] transition-colors"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-semibold">
              Title <span className="text-[#ED3941]">*</span>
            </label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0F0D2B] text-white border border-[#2D2A50] rounded px-4 py-3 outline-none focus:border-[#F68E2D] transition-colors placeholder:text-white/40"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-semibold">
              Reason <span className="text-[#ED3941]">*</span>
            </label>
            <textarea
              placeholder="Message..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              className="w-full bg-[#0F0D2B] text-white border border-[#2D2A50] rounded px-4 py-3 outline-none focus:border-[#F68E2D] transition-colors placeholder:text-white/40 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 justify-center pt-4">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="w-48 bg-white hover:bg-white/90 text-[#14123A] text-sm font-semibold py-3 transition-colors rounded"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="w-48 bg-[#F68E2D] hover:bg-[#e57d1f] text-white text-sm font-semibold py-3 transition-colors rounded disabled:opacity-50"
            >
              {isSubmittingForm ? "Sending..." : "Send Request"}
            </button>
          </div>

        </form>
      </div>
    );
  }

  // 2. Render Leave Request List table
  return (
    <div className="space-y-6 text-white animate-fadeIn">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl font-semibold leading-tight">Leave Management</h1>
          <p className="text-white/70 text-sm mt-1">Manage all leave requests here.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, type, or title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-white/20 rounded text-white placeholder:text-white/40 outline-none focus:border-[#F68E2D] text-sm"
            />
          </div>
          {isCounsellor && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors whitespace-nowrap"
            >
              + Request Leave
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-white/10 rounded-lg bg-[#0F0D2B]">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#14123A] border-b border-white/10 text-white">
              {["Image", "Name", "Start Date", "End Date", "Status", "Action"].map((h) => (
                <th key={h} className="px-5 py-4 text-center font-semibold border-r last:border-r-0 border-white/10">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center border-b border-white/10">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68E2D]"></div>
                  </div>
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((leave) => (
                <tr key={leave.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                  {/* Image */}
                  <td className="px-5 py-4 text-center border-r border-white/10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mx-auto ${getAvatarColor(
                        leave.name
                      )}`}
                    >
                      {leave.name.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  {/* Name */}
                  <td className="px-5 py-4 text-center border-r border-white/10 font-medium">{leave.name}</td>
                  {/* Dates */}
                  <td className="px-5 py-4 text-center border-r border-white/10">{formatDate(leave.startDate)}</td>
                  <td className="px-5 py-4 text-center border-r border-white/10">{formatDate(leave.endDate)}</td>
                  {/* Status */}
                  <td className="px-5 py-4 text-center border-r border-white/10">
                    <span
                      className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider inline-block ${getStatusBadge(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewLeave(leave)}
                        className="w-7 h-7 rounded-lg bg-[#F7941D] hover:bg-[#e28518] flex items-center justify-center transition-colors"
                        aria-label="View Details"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </button>

                      {/* Only show Approve/Reject action buttons for Agent (not admin or counsellor) on pending requests */}
                      {!isCounsellor && userRole !== "admin" && leave.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLeave(leave);
                              setShowModal(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-[#22C55E] hover:bg-[#1ea852] flex items-center justify-center transition-colors"
                            aria-label="Approve"
                            title="Approve Request"
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLeave(leave);
                              setShowModal(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-[#ED3941] hover:bg-[#d1323a] flex items-center justify-center transition-colors"
                            aria-label="Reject"
                            title="Reject Request"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </>
                      )}

                      {/* Delete option - available for parent agent owners and admins (not counsellors) */}
                      {!isCounsellor && (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(leave)}
                          className="w-7 h-7 rounded-lg bg-[#ED3941] hover:bg-[#d1323a] flex items-center justify-center transition-colors"
                          aria-label="Delete"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-white/50">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-white">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-white/40">...</span>
              ) : (
                <button
                  key={i}
                  onClick={() => goTo(p as number)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-[#F68E2D] text-white"
                      : "border border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-white/60 text-xs">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
          </div>
        </div>
      )}

      {/* Leave Request Detail Review Modal */}
      {showModal && selectedLeave && (
        <LeaveRequestModal
          leave={selectedLeave}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => {
            setShowModal(false);
            setSelectedLeave(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-[#14123A] border border-[#2E325D] p-6 rounded-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Delete Leave Request</h2>
            <p className="text-white/80 mb-2">
              Are you sure you want to delete <span className="font-semibold">{deleteLeaveName}</span>'s leave request?
            </p>
            <p className="text-red-400 text-sm mb-6">This action cannot be undone.</p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeleteLeaveId(null);
                  setDeleteLeaveName("");
                }}
                disabled={isDeleting}
                className="flex-1 bg-white hover:bg-white/90 text-[#14123A] text-sm font-semibold py-2.5 transition-colors rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLeave}
                disabled={isDeleting}
                className="flex-1 bg-[#ED3941] hover:bg-[#d1323a] text-white text-sm font-semibold py-2.5 transition-colors rounded disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
