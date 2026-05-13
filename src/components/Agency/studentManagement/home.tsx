"use client";

import { PlusIcon, Trash2, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import StudentInfo from "./info";
import AddStudent from "./addStudent";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import toast from "react-hot-toast";


type Agent = {
  id: string;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: "blue" | "orange" | "red";
  online: boolean;
};

type StudentApiResponse = {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  employmentInformation?: Array<{
    companyName: string;
    role: string;
  }>;
  agentId?: {
    firstName: string;
    lastName: string;
  };
};

const ENTRIES_OPTIONS = [8, 16, 24];
const TOTAL = 50;

const mapStudentToAgent = (student: StudentApiResponse): Agent => {
  const latestJob = student.employmentInformation?.[student.employmentInformation.length - 1];
  const designation = latestJob?.role || "Student";

  return {
    id: student._id,
    name: `${student.firstName} ${student.lastName}`,
    designation: designation,
    mobile: student.mobileNumber,
    email: student.emailId,
    location: "Not Specified",
    avatar: "/avatar.jpg",
    verified: "blue",
    online: true,
  };
};

const StudentManagementHome: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null);
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [deleteStudentName, setDeleteStudentName] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data: StudentApiResponse[] = await response.json();
        const mappedAgents = data.map(mapStudentToAgent);
        setAgents(mappedAgents);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.designation.toLowerCase().includes(search.toLowerCase())
  );

  const verifiedColors: Record<string, string> = {
    blue: "#3B82F6",
    orange: "#F68E2D",
    red: "#E03137",
  };

  const handleAvatarError = (studentId: string) => {
    setFailedAvatars((prev) => new Set(prev).add(studentId));
  };

  const getAvatarSrc = (studentId: string, defaultSrc: string) => {
    return failedAvatars.has(studentId) ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E" : defaultSrc;
  };

  const openDeleteDialog = (studentId: string, studentName: string) => {
    setDeleteStudentId(studentId);
    setDeleteStudentName(studentName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteStudentId || !deleteStudentName) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${deleteStudentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      // Remove the student from the list
      setAgents(agents.filter((agent) => agent.id !== deleteStudentId));
      toast.success(`${deleteStudentName} has been deleted successfully`);
      setDeleteDialogOpen(false);
      setDeleteStudentId(null);
      setDeleteStudentName(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete student");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteStudentId(null);
    setDeleteStudentName(null);
  };

  const totalPages = Math.ceil(agents.length / entriesPerPage) || 1;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 3;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3);
      if (totalPages > maxPagesToShow) {
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D]"></div>
          <p className="mt-4">Loading students...</p>
        </div>
      </div>
    );
  }

  if (showAddAgent) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowAddAgent(false)}
          className="text-white/80 hover:text-white text-sm"
        >
          ← Back to Student Management
        </button>
        <AddStudent onClose={() => setShowAddAgent(false)} />
      </div>
    );
  }

  if (viewingAgent) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setViewingAgent(null)}
          className="text-white/80 hover:text-white text-sm"
        >
          ← Back to Student Management
        </button>
        <StudentInfo studentId={viewingAgent.id} onClose={() => setViewingAgent(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-gray-800 placeholder-gray-400 px-4 py-2 pr-10 rounded border border-gray-200 focus:outline-none"
          />
          <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
        <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2 rounded font-medium flex items-center gap-2 transition-colors">
          Agent Type
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setShowAddAgent(true)}
          className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2 rounded font-medium flex items-center gap-2 transition-colors"
        >
          
          <PlusIcon />
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#14112E] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <p>No students found. {search ? "Try adjusting your search." : "Add your first student!"}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-white text-left font-semibold">Image</th>
                  <th className="px-6 py-4 text-white text-center font-semibold">Name</th>
                  <th className="px-6 py-4 text-white text-center font-semibold">Designation</th>
                  <th className="px-6 py-4 text-white text-center font-semibold">Mobile Number</th>
                  <th className="px-6 py-4 text-white text-center font-semibold">Email</th>
                  <th className="px-6 py-4 text-white text-center font-semibold">Location</th>
                  <th className="px-6 py-4 text-white text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((agent, index) => (
                  <tr
                    key={agent.id}
                    className={`border-b border-gray-800 hover:bg-[#1a1640] transition-colors ${
                      index === filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <td className="px-6 py-4">
                      <div className="relative w-10 h-10">
                        <img
                          src={getAvatarSrc(agent.id, agent.avatar)}
                          alt={agent.name}
                          onError={() => handleAvatarError(agent.id)}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 bg-gray-700"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#14112E] ${
                            agent.online ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-white">
                        {agent.name}
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: verifiedColors[agent.verified] }}
                        >
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8 15.414l-4.707-4.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="px-6 py-4 text-white text-center whitespace-nowrap">{agent.designation}</td>

                    {/* Mobile */}
                    <td className="px-6 py-4 text-white text-center">{agent.mobile}</td>

                    {/* Email */}
                    <td className="px-6 py-4 text-white text-center">{agent.email}</td>

                    {/* Location */}
                    <td className="px-6 py-4 text-white text-center">{agent.location}</td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => setViewingAgent({...agent, id: agent.id})}
                          className="w-8 h-8 bg-[#F68E2D] hover:bg-[#e57d1f] rounded-lg flex items-center justify-center transition-colors"
                          aria-label="View"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {/* Edit and Delete buttons... */}
                        <button 
                          onClick={() => setViewingAgent({...agent, id: agent.id})}
                          className="w-7 h-7 rounded-md bg-[#3B49DF] hover:bg-[#3340c9] flex items-center justify-center transition-colors" 
                          aria-label="Edit preference"
                        >
                          <Pencil className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button 
                          onClick={() => openDeleteDialog(agent.id, agent.name)}
                          className="w-7 h-7 rounded-md bg-[#E03137] hover:bg-[#c82a30] flex items-center justify-center transition-colors" 
                          aria-label="Delete student"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded text-white hover:bg-[#1a1640] disabled:opacity-40"
          >
            &#8249;
          </button>
          {getPageNumbers().map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={idx}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#F68E2D] text-white"
                    : "text-white hover:bg-[#1a1640]"
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="text-white px-1">...</span>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded text-white hover:bg-[#1a1640] disabled:opacity-40"
          >
            &#8250;
          </button>
        </div>

        {/* Entries Info + Show Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{" "}
            {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="relative">
            <button
              onClick={() => setShowEntriesDropdown((v) => !v)}
              className="flex items-center gap-2 text-white bg-[#14112E] border border-gray-700 px-3 py-1 rounded text-sm"
            >
              Show {entriesPerPage}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showEntriesDropdown && (
              <div className="absolute right-0 bottom-8 bg-[#14112E] border border-gray-700 rounded shadow-lg z-10">
                {ENTRIES_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setEntriesPerPage(opt); setShowEntriesDropdown(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      entriesPerPage === opt ? "bg-[#F68E2D] text-white" : "text-white hover:bg-[#1a1640]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        studentName={deleteStudentName || ""}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StudentManagementHome;