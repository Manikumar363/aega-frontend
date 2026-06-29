"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ViewAgent from "@/components/agentManagement/viewAgent";
import DashboardLayout from "@/components/ui/dashboard-layout";
import CDPTraining from "@/components/agentManagement/cdpTraining";
import Compliances from "@/components/agentManagement/compliances";
import Audits from "@/components/agentManagement/audits";
import { 
  getUniversityAgentRequests, 
  acceptAgentRequest, 
  rejectAgentRequest,
  type AgentRequest 
} from "@/lib/api";

export default function AgentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params?.id as string;
  const [activeTab, setActiveTab] = useState<"info" | "cdp" | "compliances" | "audits">("info");
  const [agent, setAgent] = useState<AgentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch agent data on component mount
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const requests = await getUniversityAgentRequests();
        const foundAgent = requests.find(req => req._id === agentId);
        
        if (!foundAgent) {
          setError("Agent request not found");
          return;
        }
        
        setAgent(foundAgent);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch agent details";
        setError(errorMessage);
        console.error("Error fetching agent data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentData();
    }
  }, [agentId]);

  const handleAccept = async () => {
    if (!agent) return;

    try {
      setActionLoading(true);
      await acceptAgentRequest(agent._id, "Agent request approved by university.");
      // Refresh the data
      const requests = await getUniversityAgentRequests();
      const updatedAgent = requests.find(req => req._id === agentId);
      if (updatedAgent) {
        setAgent(updatedAgent);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to accept request";
      setError(errorMessage);
      console.error("Error accepting request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!agent) return;

    try {
      setActionLoading(true);
      await rejectAgentRequest(agent._id, "Agent request rejected by university.");
      // Refresh the data
      const requests = await getUniversityAgentRequests();
      const updatedAgent = requests.find(req => req._id === agentId);
      if (updatedAgent) {
        setAgent(updatedAgent);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject request";
      setError(errorMessage);
      console.error("Error rejecting request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="university">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D] mb-4"></div>
            <p className="text-gray-400">Loading agent details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !agent) {
    return (
      <DashboardLayout role="university">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || "Agent not found"}</p>
            <button
              onClick={() => router.back()}
              className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="university">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Top Tabs and Raise Complaint */}
      <div className="flex items-center justify-between border-b border-[#F68E2D] pb-1 mb-6 flex-wrap gap-4">
        <div className="flex gap-8">
          <button
            className={`font-semibold pb-2 px-1 border-b-2 whitespace-nowrap ${
              activeTab === "info"
                ? "text-[#F68E2D] border-[#F68E2D]"
                : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
          <button
            className={`font-semibold pb-2 px-1 border-b-2 whitespace-nowrap ${
              activeTab === "cdp"
                ? "text-[#F68E2D] border-[#F68E2D]"
                : "text-white border-transparent hover:text-[#F68E2D]"
            }`}
            onClick={() => setActiveTab("cdp")}
          >
            CDP Training
          </button>
          <div className="relative group">
            <button
              className={`font-semibold pb-2 px-1 border-b-2 whitespace-nowrap ${
                activeTab === "compliances"
                  ? "text-[#F68E2D] border-[#F68E2D]"
                  : "text-white border-transparent hover:text-[#F68E2D]"
              }`}
              onClick={() => setActiveTab("compliances")}
            >
              Compliances <span className="ml-1">&#9662;</span>
            </button>
            {/* Dropdown can go here if needed */}
          </div>
          <div className="relative group">
            <button
              className={`font-semibold pb-2 px-1 border-b-2 whitespace-nowrap ${
                activeTab === "audits"
                  ? "text-[#F68E2D] border-[#F68E2D]"
                  : "text-white border-transparent hover:text-[#F68E2D]"
              }`}
              onClick={() => setActiveTab("audits")}
            >
              Audits <span className="ml-1">&#9662;</span>
            </button>
            {/* Dropdown can go here if needed */}
          </div>
        </div>
        
        {agent.status === "pending" && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAccept}
              disabled={actionLoading}
              className="bg-[#22C55E] hover:bg-[#1ea852] text-white px-6 py-2 rounded font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>✓</span> Accept Request
                </>
              )}
            </button>
            <button 
              onClick={handleReject}
              disabled={actionLoading}
              className="bg-[#E03137] hover:bg-[#c41e24] text-white px-6 py-2 rounded font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>✕</span> Reject Request
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <div className="inline-block">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            agent.status === "pending"
              ? "bg-yellow-400/20 text-yellow-400"
              : agent.status === "accepted"
              ? "bg-green-400/20 text-green-400"
              : "bg-red-400/20 text-red-400"
          }`}>
            Status: {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {activeTab === "info" && <ViewAgent agent={agent} />}
        {activeTab === "cdp" && <CDPTraining />}
        {activeTab === "compliances" && <Compliances targetId={agent.agentProfile?.id} targetType="agent" />}
        {activeTab === "audits" && <Audits targetId={agent.agentProfile?.id} targetType="agent" />}
      </div>
    </DashboardLayout>
  );
}