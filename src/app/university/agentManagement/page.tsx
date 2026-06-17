"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect } from "react";
import ViewAgent from "@/components/agentManagement/viewAgent";
import { useRouter } from "next/navigation";
import { 
  getUniversityAgentRequests, 
  acceptAgentRequest, 
  rejectAgentRequest,
  type AgentRequest 
} from "@/lib/api";

export default function UniversityAgentManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentRequest | null>(null);
  const [agents, setAgents] = useState<AgentRequest[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<AgentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  // Fetch agent requests on component mount
  useEffect(() => {
    const fetchAgentRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUniversityAgentRequests();
        setAgents(data);
        setFilteredAgents(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch agent requests";
        setError(errorMessage);
        console.error("Error fetching agent requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentRequests();
  }, []);

  // Filter agents based on search query
  useEffect(() => {
    const filtered = agents.filter((agent) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        agent.universityName?.toLowerCase().includes(searchLower) ||
        agent.universityEmail?.toLowerCase().includes(searchLower) ||
        agent.agentRole?.toLowerCase().includes(searchLower) ||
        agent.agentBusinessType?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredAgents(filtered);
    setCurrentPage(1);
  }, [searchQuery, agents]);

  // Handle accept request
  const handleAccept = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await acceptAgentRequest(requestId, "Agent request approved by university.");
      // Refresh the list
      const updated = await getUniversityAgentRequests();
      setAgents(updated);
      setFilteredAgents(updated);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to accept request";
      setError(errorMessage);
      console.error("Error accepting request:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject request
  const handleReject = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await rejectAgentRequest(requestId, "Agent request rejected by university.");
      // Refresh the list
      const updated = await getUniversityAgentRequests();
      setAgents(updated);
      setFilteredAgents(updated);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject request";
      setError(errorMessage);
      console.error("Error rejecting request:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "accepted":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  // Get status badge background
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-400/20";
      case "accepted":
        return "bg-green-400/20";
      case "rejected":
        return "bg-red-400/20";
      default:
        return "bg-gray-400/20";
    }
  };

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filteredAgents.length / entriesPerPage);

  return (
    <DashboardLayout role="university">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Agent Details Modal */}
      {showAgentModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#14112E] rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              className="absolute top-4 right-4 text-white bg-[#F68E2D] hover:bg-[#e57d1f] rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setShowAgentModal(false)}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6">
              <ViewAgent agent={selectedAgent} />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Search and Add Agent */}
        <div className="flex items-center gap-6">
          <div className="flex-1 relative max-w-4xl">
            <input
              type="text"
              placeholder="Search by university name, email, or agent type..."
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
        </div>

        {/* Table or Loading/Empty State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D] mb-4"></div>
              <p className="text-gray-400">Loading agent requests...</p>
            </div>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="bg-[#14112E] border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400">No agent requests found.</p>
          </div>
        ) : (
          <>
            <div className="bg-[#14112E] border border-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0a0820] border-b border-gray-800">
                      <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">University Name</th>
                      <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Email</th>
                      <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Agent Role</th>
                      <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Business Type</th>
                      <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Status</th>
                      <th className="text-left px-6 py-4 text-white font-semibold whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAgents.map((agent, index) => (
                      <tr
                        key={agent._id}
                        className={`border-b border-gray-800 hover:bg-[#1a1640] transition-colors ${
                          index === paginatedAgents.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <span className="text-white">{agent.universityName}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{agent.universityEmail}</td>
                        <td className="px-6 py-4 text-gray-300 capitalize">{agent.agentRole}</td>
                        <td className="px-6 py-4 text-gray-300 capitalize">{agent.agentBusinessType?.replace(/_/g, " ")}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(agent.status)} ${getStatusColor(agent.status)}`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="w-8 h-8 bg-[#F68E2D] hover:bg-[#e57d1f] rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                              aria-label="View details"
                              onClick={() => {
                                setSelectedAgent(agent);
                                setShowAgentModal(true);
                              }}
                              disabled={actionLoading === agent._id}
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
                            {agent.status === "pending" && (
                              <>
                                <button 
                                  className="w-8 h-8 bg-[#22C55E] hover:bg-[#1ea852] rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Approve agent"
                                  onClick={() => handleAccept(agent._id)}
                                  disabled={actionLoading !== null}
                                >
                                  {actionLoading === agent._id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </button>
                                <button 
                                  className="w-8 h-8 bg-[#E03137] hover:bg-[#c41e24] rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Reject agent"
                                  onClick={() => handleReject(agent._id)}
                                  disabled={actionLoading !== null}
                                >
                                  {actionLoading === agent._id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </>
                            )}
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
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded flex items-center justify-center font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#F68E2D] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {totalPages > 5 && <span className="text-gray-400 px-2">...</span>}
                
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded flex items-center justify-center font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-[#F68E2D] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-400 text-sm">
                <span className="whitespace-nowrap">
                  Showing {filteredAgents.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredAgents.length)} of {filteredAgents.length} entries
                </span>
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
