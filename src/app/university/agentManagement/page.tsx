"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect } from "react";
import ViewAgent from "@/components/agentManagement/viewAgent";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAuthToken } from "@/lib/api";
import { User, Plus, X, Search, Trash2, ShieldAlert } from "lucide-react";

export default function UniversityAgentManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  
  // Modals
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Add Agent Form State
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");
  const [newAgentPhone, setNewAgentPhone] = useState("");
  const [newAgentType, setNewAgentType] = useState<"b2b" | "b2c">("b2b");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Fetch agents list on mount
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/me/agents`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch university agents");
      }

      const resData = await res.json();
      setAgents(resData.data || []);
      setFilteredAgents(resData.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agents";
      setError(errorMessage);
      console.error("Error fetching agents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [router]);

  // Filter agents based on search query
  useEffect(() => {
    const filtered = agents.filter((agent: any) => {
      const searchLower = searchQuery.toLowerCase();
      const agentName = typeof agent.agentId === "object" && agent.agentId ? agent.agentId.name : "";
      const agentEmail = typeof agent.agentId === "object" && agent.agentId ? agent.agentId.email : "";
      const agentPhone = typeof agent.agentId === "object" && agent.agentId ? (agent.agentId.phone || "") : "";
      const agentMobile = agent.agentProfile?.mobileNumber || "";
      return (
        agentName.toLowerCase().includes(searchLower) ||
        agentEmail.toLowerCase().includes(searchLower) ||
        agentPhone.includes(searchLower) ||
        agentMobile.includes(searchLower) ||
        agent.agentRole?.toLowerCase().includes(searchLower) ||
        agent.agentBusinessType?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredAgents(filtered);
    setCurrentPage(1);
  }, [searchQuery, agents]);

  // Handle direct Agent addition by University
  const handleAddAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!newAgentName.trim() || !newAgentEmail.trim() || !newAgentPhone.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (newAgentEmail.includes(" ") || newAgentPhone.includes(" ")) {
      toast.error("Spaces are not allowed in email or phone fields.");
      return;
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAgentEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/me/agents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newAgentName.trim(),
          email: newAgentEmail.trim(),
          phone: newAgentPhone.trim(),
          businessType: newAgentType
        })
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || resData.error || "Failed to add agent.");
      }

      toast.success("Agent added successfully!");
      setShowAddModal(false);
      
      // Reset form
      setNewAgentName("");
      setNewAgentEmail("");
      setNewAgentPhone("");
      setNewAgentType("b2b");

      // Reload
      fetchAgents();
    } catch (err: any) {
      toast.error(err.message || "Failed to add agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle agent deletion
  const handleDeleteAgent = async (agentUserId: string) => {
    if (!confirm("Are you sure you want to delete this agent? This will permanently disable their login and remove their profile.")) {
      return;
    }

    try {
      setActionLoading(agentUserId);
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/me/agents/${agentUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Failed to delete agent");
      }

      toast.success("Agent deleted successfully!");
      fetchAgents();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete agent");
    } finally {
      setActionLoading(null);
    }
  };

  // Get status badge colors
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
      <div className="space-y-6 text-white pb-10">
        {/* Module Page Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-4 gap-4 text-left">
          <div>
            <h1 className="text-3xl font-bold tracking-wide uppercase">University Agent Management</h1>
            <p className="text-sm text-gray-400">Manage and recruit certified agency representatives</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Agent</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-left">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Add Agent Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
            <div className="bg-[#14112E] border border-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="flex items-center justify-between bg-[#0a0820] px-6 py-4 border-b border-gray-800">
                <h3 className="text-md font-bold uppercase tracking-wider text-[#F68E2D]">Add New Agent</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddAgentSubmit} className="p-6 space-y-4 text-xs text-left">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Agent Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. John Doe / Global Recruitment"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Agent Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. john@recruitment.com"
                    value={newAgentEmail}
                    onChange={(e) => setNewAgentEmail(e.target.value.replace(/\s/g, ""))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Agent Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. +44 1234 5678"
                    value={newAgentPhone}
                    onChange={(e) => setNewAgentPhone(e.target.value.replace(/[^0-9+\s-]/g, ""))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                {/* Agent Type Drop-down */}
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Agent Type *</label>
                  <select
                    value={newAgentType}
                    onChange={(e) => setNewAgentType(e.target.value as "b2b" | "b2c")}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D] cursor-pointer"
                  >
                    <option value="b2b">B2B Agent (Agency / Company)</option>
                    <option value="b2c">B2C Agent (Individual Counsellor)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#F68E2D] hover:bg-[#e28124] text-white rounded-lg font-bold uppercase cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Agent"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Agent Details Modal */}
        {showAgentModal && selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
            <div className="bg-[#14112E] border border-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-750 p-2 rounded-full cursor-pointer z-10"
                onClick={() => setShowAgentModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-6">
                <ViewAgent agent={selectedAgent} />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex items-center gap-6">
            <div className="flex-1 relative max-w-4xl">
              <input
                type="text"
                placeholder="Search by agent name, email, mobile, or type..."
                style={{ color: "#ffffff" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#14112E] border border-gray-800 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#F68E2D]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F68E2D]"></div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="bg-[#14112E] border border-gray-800 rounded-xl p-12 text-center">
              <p className="text-gray-400">No agents registered under your university yet.</p>
            </div>
          ) : (
            <>
              <div className="bg-[#14112E] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#0a0820] border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                        <th className="px-6 py-4">Agent Name</th>
                        <th className="px-6 py-4">Agent Email</th>
                        <th className="px-6 py-4">Mobile Number</th>
                        <th className="px-6 py-4">Agent Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {paginatedAgents.map((agent, index) => {
                        const name = typeof agent.agentId === "object" && agent.agentId ? agent.agentId.name : "Unknown";
                        const email = typeof agent.agentId === "object" && agent.agentId ? agent.agentId.email : "N/A";
                        const phone = agent.agentProfile?.mobileNumber || (typeof agent.agentId === "object" ? agent.agentId.phone : "") || "N/A";
                        const type = agent.agentBusinessType === "b2b" ? "B2B Agent" : "B2C Counsellor";
                        const userId = typeof agent.agentId === "object" && agent.agentId ? agent.agentId._id : agent.agentId;
                        
                        return (
                          <tr
                            key={agent._id}
                            className={`border-b border-gray-800 hover:bg-[#1f1a44]/50 transition-colors ${
                              index === paginatedAgents.length - 1 ? "border-b-0" : ""
                            }`}
                          >
                            <td className="px-6 py-4 font-bold text-white">{name}</td>
                            <td className="px-6 py-4 text-gray-300">{email}</td>
                            <td className="px-6 py-4 text-gray-300">{phone}</td>
                            <td className="px-6 py-4 capitalize text-gray-300">{type}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBgColor(agent.status)} ${getStatusColor(agent.status)}`}>
                                {agent.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  className="px-3 py-1.5 bg-[#F68E2D] hover:bg-[#e57d1f] rounded text-white font-bold cursor-pointer transition-colors"
                                  onClick={() => {
                                    setSelectedAgent(agent);
                                    setShowAgentModal(true);
                                  }}
                                  title="View Agent Profile"
                                >
                                  View Profile
                                </button>
                                <button
                                  className="p-2 bg-red-600/20 hover:bg-red-600 hover:text-white text-red-400 rounded cursor-pointer transition-colors"
                                  onClick={() => handleDeleteAgent(userId)}
                                  disabled={actionLoading === userId}
                                  title="Delete Agent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-xs text-gray-400">
                    Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                    {Math.min(currentPage * entriesPerPage, filteredAgents.length)} of{" "}
                    {filteredAgents.length} entries
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs disabled:opacity-50 cursor-pointer text-white"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-3 py-1.5 rounded text-xs cursor-pointer font-bold ${
                          currentPage === idx + 1 ? "bg-[#F68E2D] text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs disabled:opacity-50 cursor-pointer text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
