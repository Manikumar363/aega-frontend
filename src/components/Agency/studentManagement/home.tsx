"use client";

import { PlusIcon, Trash2, Pencil } from "lucide-react";
import React, { useState } from "react";
import StudentInfo from "./info";
import AddStudent from "./addStudent";


type Agent = {
  id: number;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: "blue" | "orange" | "red";
  online: boolean;
};

const agents: Agent[] = [
  { id: 1, name: "Liam", designation: "Managing Director", mobile: "5506556340", email: "liam@gmail.com", location: "Hyderabad", avatar: "/avatar.jpg", verified: "blue", online: true },
  { id: 2, name: "Mason", designation: "Chief Operating Officer", mobile: "9876543210", email: "mason@gmail.com", location: "Hyderabad", avatar: "/avatar.jpg", verified: "orange", online: true },
  { id: 3, name: "Liam", designation: "Chief Marketing Officer", mobile: "6543217890", email: "liam@gmail.com", location: "Bangalore", avatar: "/avatar.jpg", verified: "blue", online: false },
  { id: 4, name: "Liam", designation: "Chief Financial Officer", mobile: "7890123456", email: "liam@gmail.com", location: "Hyderabad", avatar: "/avatar.jpg", verified: "blue", online: false },
  { id: 5, name: "Mason", designation: "Education Counselor", mobile: "1234567890", email: "mason@gmail.com", location: "Bangalore", avatar: "/avatar.jpg", verified: "orange", online: true },
  { id: 6, name: "Mason", designation: "Student Counselor", mobile: "4567890123", email: "mason@gmail.com", location: "Hyderabad", avatar: "/avatar.jpg", verified: "orange", online: true },
  { id: 7, name: "Liam", designation: "Career Counselor", mobile: "9876504321", email: "liam@gmail.com", location: "Bangalore", avatar: "/avatar.jpg", verified: "blue", online: true },
  { id: 8, name: "James", designation: "Academic Advisor", mobile: "2345678901", email: "james@gmail.com", location: "Bangalore", avatar: "/avatar.jpg", verified: "blue", online: true },
  { id: 9, name: "Sarah", designation: "Admissions Counselor", mobile: "3456789012", email: "sarah@email.com", location: "Bangalore", avatar: "/avatar.jpg", verified: "blue", online: true },
  { id: 10, name: "Michael", designation: "Visa Counselor", mobile: "4567890123", email: "michael@domain.com", location: "Noida", avatar: "/avatar.jpg", verified: "blue", online: true },
];

const verifiedColors: Record<string, string> = {
  blue: "#3B82F6",
  orange: "#F68E2D",
  red: "#E03137",
};

const ENTRIES_OPTIONS = [8, 16, 24];
const TOTAL = 50;

const StudentManagementHome: React.FC = () => {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null);

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.designation.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = 10;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [1, 2, 3, "...", 10];
    return pages;
  };

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
        <StudentInfo student={viewingAgent} />
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
              {filtered.slice(0, entriesPerPage).map((agent, index) => (
                <tr
                  key={agent.id}
                  className={`border-b border-gray-800 hover:bg-[#1a1640] transition-colors ${
                    index === filtered.slice(0, entriesPerPage).length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Avatar */}
                  <td className="px-6 py-4">
                    <div className="relative w-10 h-10">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
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
                        onClick={() => setViewingAgent(agent)}
                        className="w-8 h-8 bg-[#F68E2D] hover:bg-[#e57d1f] rounded-lg flex items-center justify-center transition-colors"
                        aria-label="View"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {/* Edit and Delete buttons... */}
                      <button className="w-7 h-7 rounded-md bg-[#3B49DF] hover:bg-[#3340c9] flex items-center justify-center" aria-label="Edit preference">
										<Pencil className="w-3.5 h-3.5 text-white" />
									</button>
									<button className="w-7 h-7 rounded-md bg-[#E03137] hover:bg-[#c82a30] flex items-center justify-center" aria-label="Delete preference">
										<Trash2 className="w-3.5 h-3.5 text-white" />
					</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
            {Math.min(currentPage * entriesPerPage, TOTAL)} of {TOTAL} entries
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
    </div>
  );
};

export default StudentManagementHome;