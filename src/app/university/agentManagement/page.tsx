"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState } from "react";

export default function UniversityAgentManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(8);

  const agents: Array<{
    id: number;
    name: string;
    verified: "blue" | "orange" | "red";
    mobile: string;
    email: string;
    agency: string;
    avatar: string;
    online: boolean;
  }> = [
    {
      id: 1,
      name: "Liam",
      verified: "blue",
      mobile: "5506556340",
      email: "liam@gmail.com",
      agency: "Freelance",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 2,
      name: "Mason",
      verified: "orange",
      mobile: "9876543210",
      email: "mason@gmail.com",
      agency: "Quantum",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 3,
      name: "Ava",
      verified: "red",
      mobile: "3214569870",
      email: "ava@gmail.com",
      agency: "Sky One",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 4,
      name: "Liam",
      verified: "blue",
      mobile: "6543217890",
      email: "liam@gmail.com",
      agency: "Verity Global",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 5,
      name: "Liam",
      verified: "blue",
      mobile: "7890123456",
      email: "liam@gmail.com",
      agency: "Freelance",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 6,
      name: "Mason",
      verified: "orange",
      mobile: "1234567890",
      email: "mason@gmail.com",
      agency: "Apex Innovations",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 7,
      name: "Ava",
      verified: "red",
      mobile: "0987654321",
      email: "ava@gmail.com",
      agency: "Freelance",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 8,
      name: "Mason",
      verified: "orange",
      mobile: "4567890123",
      email: "mason@gmail.com",
      agency: "Nova Enterprises",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 9,
      name: "Liam",
      verified: "blue",
      mobile: "9876504321",
      email: "liam@gmail.com",
      agency: "Freelance",
      avatar: "/avatar.jpg",
      online: true,
    },
    {
      id: 10,
      name: "James",
      verified: "blue",
      mobile: "2345678901",
      email: "james@gmail.com",
      agency: "Summit Group",
      avatar: "/avatar.jpg",
      online: true,
    },
  ];

  const verifiedColors = {
    blue: "#3B82F6",
    orange: "#F68E2D",
    red: "#E03137",
  };

  return (
    <DashboardLayout role="university">
      <div className="space-y-6">
        {/* Search and Add Agent */}
        <div className="flex items-center gap-6">
          <div className="flex-1 relative max-w-4xl">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#03091F] border border-gray-300 rounded-md px-4 py-3 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-8 py-3 rounded-md flex items-center gap-2 font-medium transition-colors whitespace-nowrap">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Agent
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#14112E] border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0a0820] border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Image</th>
                  <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Name</th>
                  <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Mobile Number</th>
                  <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Email</th>
                  <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Agency</th>
                  <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {agents.slice(0, entriesPerPage).map((agent, index) => (
                  <tr
                    key={agent.id}
                    className={`border-b border-gray-800 hover:bg-[#1a1640] transition-colors ${
                      index === agents.slice(0, entriesPerPage).length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-10 h-10">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-lg font-semibold text-gray-800">
                          {agent.name.charAt(0)}
                        </div>
                        {agent.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#14112E]"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{agent.name}</span>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: verifiedColors[agent.verified] }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white whitespace-nowrap">{agent.mobile}</td>
                    <td className="px-6 py-4 text-white">{agent.email}</td>
                    <td className="px-6 py-4 text-white whitespace-nowrap">{agent.agency}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="w-8 h-8 bg-[#F68E2D] hover:bg-[#e57d1f] rounded-lg flex items-center justify-center transition-colors"
                          aria-label="View details"
                        >
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button 
                          className="w-8 h-8 bg-[#3B82F6] hover:bg-[#2563eb] rounded-lg flex items-center justify-center transition-colors"
                          aria-label="Edit agent"
                        >
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button 
                          className="w-8 h-8 bg-[#E03137] hover:bg-[#c41e24] rounded-lg flex items-center justify-center transition-colors"
                          aria-label="Delete agent"
                        >
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded flex items-center justify-center font-medium transition-colors ${
                currentPage === 1
                  ? "bg-[#F68E2D] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded flex items-center justify-center font-medium transition-colors ${
                currentPage === 2
                  ? "bg-[#F68E2D] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded flex items-center justify-center font-medium transition-colors ${
                currentPage === 3
                  ? "bg-[#F68E2D] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              3
            </button>
            <span className="text-gray-400 px-2">...</span>
            <button
              onClick={() => setCurrentPage(10)}
              className={`w-8 h-8 rounded flex items-center justify-center font-medium transition-colors ${
                currentPage === 10
                  ? "bg-[#F68E2D] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              10
            </button>
            
            <button
              onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
              disabled={currentPage === 10}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-400 text-sm">
            <span className="whitespace-nowrap">Showing 1 to {Math.min(entriesPerPage, agents.length)} of {agents.length} entries</span>
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-[#14112E] border border-gray-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-[#F68E2D] cursor-pointer"
              >
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}