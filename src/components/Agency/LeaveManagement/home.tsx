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
import { mockLeaveRequests } from "@/components/Agency/LeaveManagement/mockData";

// Set to true to always use mock data for testing
const USE_MOCK_DATA = true;
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

  // Fetch leave requests
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);

      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        console.log("Using mock data for testing");
        const transformedLeaves = mockLeaveRequests.map((leave) => ({
          id: leave._id,
          name: leave.name,
          designation: leave.designation,
          image: leave.image,
          startDate: leave.startDate,
          endDate: leave.endDate,
          leaveType: leave.leaveType,
          title: leave.title,
          reason: leave.reason,
          status: leave.status,
        }));
        console.log("Transformed mock leaves:", transformedLeaves);
        setLeaves(transformedLeaves);
        return;
      }

      const token = localStorage.getItem("authToken");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves`;

      console.log("Fetching from URL:", url);
      console.log("Auth token:", token ? "Present" : "Missing");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch leaves: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);

      // Handle multiple response formats
      let parsedData = Array.isArray(data)
        ? data
        : data.leaves || data.data || [];
      console.log("Parsed data:", parsedData);

      const transformedLeaves = parsedData.map(
        (leave: ApiLeaveResponse) => ({
          id: leave._id,
          name: leave.name,
          designation: leave.designation,
          image: leave.image,
          startDate: leave.startDate,
          endDate: leave.endDate,
          leaveType: leave.leaveType,
          title: leave.title,
          reason: leave.reason,
          status: leave.status,
        })
      );

      console.log("Transformed leaves:", transformedLeaves);
      setLeaves(transformedLeaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      // Fallback to mock data on error
      const transformedLeaves = mockLeaveRequests.map((leave) => ({
        id: leave._id,
        name: leave.name,
        designation: leave.designation,
        image: leave.image,
        startDate: leave.startDate,
        endDate: leave.endDate,
        leaveType: leave.leaveType,
        title: leave.title,
        reason: leave.reason,
        status: leave.status,
      }));
      console.log("Using mock data as fallback:", transformedLeaves);
      setLeaves(transformedLeaves);
      toast.error("Using test data - API connection failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Filter leaves by search
  const filtered = useMemo(() => {
    return leaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(search.toLowerCase()) ||
        leave.designation.toLowerCase().includes(search.toLowerCase())
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

  // Handle approve leave request
  const handleApprove = async () => {
    if (!selectedLeave) return;

    try {
      setIsApproving(true);
      const token = localStorage.getItem("authToken");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaves/${selectedLeave.id}/approve`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve leave request");
      }

      toast.success(`Leave request for ${selectedLeave.name} approved`);
      setShowModal(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      console.error("Error approving leave:", error);
      toast.error("Failed to approve leave request");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle reject leave request
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
        throw new Error("Failed to reject leave request");
      }

      toast.success(`Leave request for ${selectedLeave.name} rejected`);
      setShowModal(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error("Failed to reject leave request");
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
        throw new Error("Failed to delete leave request");
      }

      toast.success(`Leave request for ${deleteLeaveName} deleted`);
      setDeleteDialogOpen(false);
      setDeleteLeaveId(null);
      setDeleteLeaveName("");
      fetchLeaves();
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error("Failed to delete leave request");
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

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
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
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 justify-center">
        <div>
          <h1 className="text-white text-3xl font-semibold leading-tight">Leave Management</h1>
          <p className="text-white/85 text-sm mt-2">Manage all leave requests here.</p>
        </div>
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none text-sm"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2.5 rounded text-sm font-medium whitespace-nowrap transition-colors">
          Status <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#14123A] text-white">
              {["Image", "Name", "Start Date", "End Date", "Status", "Action"].map((h) => (
                <th key={h} className="px-5 py-4 text-center font-semibold border border-[#2D2A50]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center border border-[#2D2A50] text-white/60">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68E2D]"></div>
                  </div>
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((leave) => (
                <tr key={leave.id} className="bg-[#0F0D2B] text-white hover:bg-[#14123A] transition-colors">
                  <td className="px-5 py-4 text-center border border-[#2D2A50]">
                    {leave.image ? (
                      <img
                        src={leave.image}
                        alt={leave.name}
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mx-auto ${getAvatarColor(
                          leave.name
                        )}`}
                      >
                        {leave.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center border border-[#2D2A50]">{leave.name}</td>
                  <td className="px-5 py-4 text-center border border-[#2D2A50]">{formatDate(leave.startDate)}</td>
                  <td className="px-5 py-4 text-center border border-[#2D2A50]">{formatDate(leave.endDate)}</td>
                  <td className="px-5 py-4 text-center border border-[#2D2A50]">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusBadge(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center border border-[#2D2A50]">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewLeave(leave)}
                        className="w-7 h-7 rounded-lg bg-[#F7941D] hover:bg-[#e28518] flex items-center justify-center transition-colors"
                        aria-label="View"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </button>

                      {leave.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLeave(leave);
                              setShowModal(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-[#22C55E] hover:bg-[#1ea852] flex items-center justify-center transition-colors"
                            aria-label="Approve"
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
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(leave)}
                        className="w-7 h-7 rounded-lg bg-[#ED3941] hover:bg-[#d1323a] flex items-center justify-center transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center border border-[#2D2A50] text-white/60">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-white">
        <div className="flex items-center gap-1">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded border border-[#2D2A50] disabled:opacity-40 hover:bg-[#14123A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={i}
                onClick={() => goTo(p as number)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  page === p
                    ? "bg-[#F68E2D] text-white"
                    : "border border-[#2D2A50] hover:bg-[#14123A] text-white"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="p-1.5 rounded border border-[#2D2A50] disabled:opacity-40 hover:bg-[#14123A] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries</span>
          <button className="flex items-center gap-1 border border-[#2D2A50] px-3 py-1 rounded hover:bg-[#14123A] transition-colors">
            Show {PAGE_SIZE} <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Leave Request Modal */}
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
                className="flex-1 bg-[#E5E7EB] hover:bg-[#d9dbe0] text-[#8C95A0] text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLeave}
                disabled={isDeleting}
                className="flex-1 bg-[#ED3941] hover:bg-[#d1323a] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
