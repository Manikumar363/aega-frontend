"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { getAuthToken } from "@/lib/api";
import AddAgent, { EditableAgent } from "./addAgent";
import ViewAgent from "./viewAgent";

type Agent = {
  id: number;
  apiId: string;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  location: string;
  avatar: string;
  verified: "blue" | "orange" | "red";
  online: boolean;
  source: EditableAgent;
};

type AgentApiItem = {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  designation: string;
  office: string;
  country: string;
  authorization?: EditableAgent["authorization"];
  createdAt?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
};

const verifiedColors: Record<string, string> = {
  blue: "#3B82F6",
  orange: "#F68E2D",
  red: "#E03137",
};

const ENTRIES_OPTIONS = [8, 16, 24];

const mapApiAgentToUi = (agent: AgentApiItem, index: number): Agent => ({
  id: index + 1,
  apiId: agent.id,
  name: `${agent.firstName} ${agent.lastName}`.trim(),
  designation: agent.designation,
  mobile: agent.mobileNumber,
  email: agent.emailId,
  location: agent.office,
  avatar: "/avatar.jpg",
  verified: "blue",
  online: true,
  source: {
    id: agent.id,
    firstName: agent.firstName,
    lastName: agent.lastName,
    emailId: agent.emailId,
    mobileNumber: agent.mobileNumber,
    designation: agent.designation,
    office: agent.office,
    country: agent.country,
    authorization: agent.authorization,
  },
});

const AgentManagementHome: React.FC = () => {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [editingAgent, setEditingAgent] = useState<EditableAgent | null>(null);
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const controller = new AbortController();

    const loadAgents = async () => {
      if (!API_BASE_URL) {
        setErrorMessage("API base URL is not configured.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/agent-management`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as AgentApiItem[] | { message?: string } | null;

        if (!response.ok) {
          const message = !Array.isArray(data) && data?.message ? data.message : `Request failed with status ${response.status}`;
          throw new Error(message);
        }

        const rows = Array.isArray(data) ? data.map(mapApiAgentToUi) : [];
        setAgents(rows);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load agents";
        setErrorMessage(message);
        setAgents([]);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();

    return () => controller.abort();
  }, [API_BASE_URL, refreshCounter]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return agents;

    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.designation.toLowerCase().includes(query),
    );
  }, [agents, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const paginatedAgents = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (!API_BASE_URL) {
      toast.error("API base URL is not configured.");
      return;
    }

    const confirmed = window.confirm(`Delete ${agent.name}?`);
    if (!confirmed) {
      return;
    }

    const loadingToastId = toast.loading("Deleting agent...");

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/agent-management/${agent.apiId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      toast.update(loadingToastId, {
        render: data?.message || "Agent deleted successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setRefreshCounter((prev) => prev + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete agent";
      toast.update(loadingToastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  if (showAddAgent) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowAddAgent(false)}
          className="text-white/80 hover:text-white text-sm"
        >
          ← Back to Agent Management
        </button>
        <AddAgent
          onSuccess={() => {
            setShowAddAgent(false);
            setRefreshCounter((prev) => prev + 1);
          }}
        />
      </div>
    );
  }

  if (editingAgent) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setEditingAgent(null)}
          className="text-white/80 hover:text-white text-sm"
        >
          ← Back to Agent Management
        </button>
        <AddAgent
          editAgent={editingAgent}
          onSuccess={() => {
            setEditingAgent(null);
            setRefreshCounter((prev) => prev + 1);
          }}
        />
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
          ← Back to Agent Management
        </button>
        <ViewAgent agent={viewingAgent} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          <span className="text-xl font-bold leading-none">+</span>
          Add Agent
        </button>
      </div>

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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-white/70">
                    Loading agents...
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-red-300">
                    {errorMessage}
                  </td>
                </tr>
              ) : paginatedAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-white/70">
                    No agents found.
                  </td>
                </tr>
              ) : (
                paginatedAgents.map((agent, index) => (
                  <tr
                    key={agent.id}
                    className={`border-b border-gray-800 hover:bg-[#1a1640] transition-colors ${
                      index === paginatedAgents.length - 1 ? "border-b-0" : ""
                    }`}
                  >
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

                    <td className="px-6 py-4 text-white text-center whitespace-nowrap">{agent.designation}</td>

                    <td className="px-6 py-4 text-white text-center">{agent.mobile}</td>

                    <td className="px-6 py-4 text-white text-center">{agent.email}</td>

                    <td className="px-6 py-4 text-white text-center">{agent.location}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
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
                        <button
                          onClick={() => setEditingAgent(agent.source)}
                          className="w-7 h-7 rounded-md bg-[#3B49DF] hover:bg-[#3340c9] flex items-center justify-center"
                          aria-label="Edit preference"
                        >
                          <Pencil className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent)}
                          className="w-7 h-7 rounded-md bg-[#E03137] hover:bg-[#c82a30] flex items-center justify-center"
                          aria-label="Delete preference"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
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

        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">
            Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} entries
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
                    onClick={() => {
                      setEntriesPerPage(opt);
                      setShowEntriesDropdown(false);
                    }}
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

export default AgentManagementHome;