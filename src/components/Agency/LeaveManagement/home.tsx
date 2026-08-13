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
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

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
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    profilePic?: string;
  } | string;
  ownerAgentId?: any;
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

  // Leave Form Modal States (Apply Leave)
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const getLoggedInUserName = () => {
    if (typeof window === "undefined") return "Team Member";
    try {
      const data = localStorage.getItem("userData");
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.fullName || parsed.name || `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || "Team Member";
      }
    } catch (e) {
      console.error(e);
    }
    return "Team Member";
  };

  // Fetch leave requests
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      // Try team endpoint first, then fallback
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (!response.ok) {
        setLeaves([]);
        return;
      }

      const data = await response.json();
      const parsedData: ApiLeaveResponse[] = Array.isArray(data)
        ? data
        : data.leaves || data.data || [];

      const transformedLeaves: LeaveRequest[] = parsedData.map((leave: ApiLeaveResponse) => {
        let name = "Counsellor";
        let image = null;

        if (leave.counsellorId && typeof leave.counsellorId === "object") {
          name = leave.counsellorId.name || `${leave.counsellorId.firstName || ""} ${leave.counsellorId.lastName || ""}`.trim() || "Counsellor";
          image = leave.counsellorId.profilePic || null;
        } else {
          name = getLoggedInUserName();
        }

        let mappedStatus: "Pending" | "Approved" | "Rejected" = "Pending";
        if (leave.status === "accepted") mappedStatus = "Approved";
        if (leave.status === "rejected") mappedStatus = "Rejected";

        return {
          id: leave._id,
          name,
          designation: "Team Staff",
          image,
          startDate: leave.startDate ? leave.startDate.slice(0, 10) : "N/A",
          endDate: leave.endDate ? leave.endDate.slice(0, 10) : "N/A",
          leaveType: leave.leaveType,
          title: leave.title,
          reason: leave.reason,
          status: mappedStatus,
        };
      });

      setLeaves(transformedLeaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Apply for Leave Handler
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reason.trim() || !startDate || !endDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmittingForm(true);
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          title: title.trim(),
          reason: reason.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit leave request.");
      }

      toast.success("Leave request submitted successfully!");
      setShowApplyModal(false);
      setTitle("");
      setReason("");
      await fetchLeaves();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit leave request.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Action: Accept / Approve
  const handleApprove = async (id: string) => {
    try {
      setIsApproving(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/${id}/accept`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to approve leave");

      toast.success("Leave request approved!");
      setShowModal(false);
      await fetchLeaves();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve leave.");
    } finally {
      setIsApproving(false);
    }
  };

  // Action: Reject
  const handleReject = async (id: string) => {
    try {
      setIsRejecting(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to reject leave");

      toast.success("Leave request rejected!");
      setShowModal(false);
      await fetchLeaves();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject leave.");
    } finally {
      setIsRejecting(false);
    }
  };

  // Action: Delete
  const handleDeleteConfirm = async () => {
    if (!deleteLeaveId) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/${deleteLeaveId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete leave");

      toast.success("Leave request deleted!");
      setDeleteDialogOpen(false);
      setDeleteLeaveId(null);
      await fetchLeaves();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete leave.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Search Filter
  const filtered = useMemo(() => {
    return leaves.filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.leaveType.toLowerCase().includes(search.toLowerCase()) ||
        l.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaves, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 text-white pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-sm text-white/60">Manage and review all leave requests here.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, type, or title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-[#14112E] border border-gray-700 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-[#F68E2D]"
            />
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-[#F68E2D] hover:bg-[#e28124] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Apply Leave
          </button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-[#14112E] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-[#0A0724] border-b border-gray-800 text-gray-300 font-bold uppercase">
                <th className="px-5 py-4 text-center">Image</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Start Date</th>
                <th className="px-5 py-4">End Date</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68E2D] mb-2"></div>
                    <p>Loading leave requests...</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                paginated.map((leave) => (
                  <tr key={leave.id} className="hover:bg-[#1A163E] transition-colors">
                    {/* Image */}
                    <td className="px-5 py-3 text-center">
                      <div className="w-9 h-9 rounded-full bg-gray-700 mx-auto overflow-hidden border border-gray-600 flex items-center justify-center font-bold text-white">
                        {leave.image ? (
                          <img src={leave.image} alt={leave.name} className="w-full h-full object-cover" />
                        ) : (
                          leave.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </td>

                    {/* Name & Title */}
                    <td className="px-5 py-3 font-semibold text-white">
                      <div>{leave.name}</div>
                      <span className="text-[10px] text-[#F68E2D]">{leave.leaveType}</span>
                    </td>

                    {/* Start Date */}
                    <td className="px-5 py-3 text-gray-300 font-medium">{leave.startDate}</td>

                    {/* End Date */}
                    <td className="px-5 py-3 text-gray-300 font-medium">{leave.endDate}</td>

                    {/* Status */}
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block ${
                          leave.status === "Approved"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : leave.status === "Rejected"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>

                    {/* Action Controls */}
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedLeave(leave); setShowModal(true); }}
                          title="View Details"
                          className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {leave.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(leave.id)}
                              disabled={isApproving}
                              title="Approve Leave"
                              className="p-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded transition-colors cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              disabled={isRejecting}
                              title="Reject Leave"
                              className="p-1.5 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 rounded transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { setDeleteLeaveId(leave.id); setDeleteLeaveName(leave.name); setDeleteDialogOpen(true); }}
                          title="Delete Request"
                          className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-400 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 text-xs text-gray-400">
            <span>Showing Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW LEAVE MODAL */}
      {showModal && selectedLeave && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#14112E] border border-gray-700 rounded-xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-[#F68E2D]">Leave Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white font-bold">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 font-semibold block">Submitted By</span>
                <span className="text-base font-bold text-white">{selectedLeave.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 font-semibold block">Leave Type</span>
                  <span className="text-white font-medium">{selectedLeave.leaveType}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Status</span>
                  <span className="text-emerald-400 font-bold">{selectedLeave.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 font-semibold block">Start Date</span>
                  <span className="text-white font-medium">{selectedLeave.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">End Date</span>
                  <span className="text-white font-medium">{selectedLeave.endDate}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block">Title / Subject</span>
                <span className="text-white font-medium">{selectedLeave.title}</span>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block">Reason</span>
                <p className="bg-[#0A0724] border border-gray-800 p-3 rounded text-gray-300 italic mt-1 leading-relaxed">
                  "{selectedLeave.reason}"
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#14112E] border border-gray-700 rounded-xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-[#F68E2D]">Apply for Leave</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-[#F68E2D]"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Maternity / Paternity Leave">Maternity / Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Subject / Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Medical Appointment"
                  className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Reason *</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Enter detailed reason"
                  className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-[#F68E2D]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="px-6 py-2 bg-[#F68E2D] hover:bg-[#e28124] text-white rounded-lg text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingForm ? "Submitting..." : "Submit Leave Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#14112E] border border-gray-700 rounded-xl p-6 max-w-sm w-full text-white space-y-4 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-red-400">Delete Leave Request?</h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to delete leave request for <span className="font-bold text-white">{deleteLeaveName}</span>?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase disabled:opacity-50"
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
