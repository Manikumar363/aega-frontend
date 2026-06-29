import React from "react";
import { type AgentRequest } from "@/lib/api";

interface Agent {
    id?: number;
    name?: string;
    verified?: "blue" | "orange" | "red";
    mobile?: string;
    email?: string;
    agency?: string;
    avatar?: string;
    online?: boolean;
}

interface ViewAgentProps {
    agent: Agent | AgentRequest;
}

const ViewAgent: React.FC<ViewAgentProps> = ({ agent }) => {
    const isAgentRequest = 'universityName' in agent && 'agentId' in agent;

    // Helper function to get agent name from either type
    const getAgentName = () => {
        if ('agentId' in agent && typeof agent.agentId === 'object' && agent.agentId !== null && 'name' in agent.agentId) {
            return (agent.agentId as any).name || 'Unknown';
        }
        if ('universityName' in agent) {
            return agent.universityName || 'Unknown';
        }
        return (agent as Agent).name || 'Unknown';
    };

    // Helper function to get agent email from either type
    const getAgentEmail = () => {
        if ('agentId' in agent && typeof agent.agentId === 'object' && agent.agentId !== null && 'email' in agent.agentId) {
            return (agent.agentId as any).email || 'N/A';
        }
        if ('universityEmail' in agent) {
            return agent.universityEmail || 'N/A';
        }
        return (agent as Agent).email || 'N/A';
    };

    // Helper function to get agent message/description
    const getAgentMessage = () => {
        if ('message' in agent) {
            return agent.message || 'No message provided';
        }
        return 'N/A';
    };

    // Helper function to get agent business type
    const getBusinessType = () => {
        if ('agentBusinessType' in agent) {
            return agent.agentBusinessType?.replace(/_/g, ' ') || 'N/A';
        }
        return 'N/A';
    };

    // Helper function to get agent role
    const getAgentRole = () => {
        if ('agentRole' in agent) {
            return agent.agentRole || 'N/A';
        }
        return 'N/A';
    };

    const performance = [
        { label: "Visa refusal (85% - 100%)", value: 75, max: 75, color: "#F68E2D" },
        { label: "Enrollment (50% - 84%)", value: 24, max: 75, color: "#2563eb" },
        { label: "withdrawn Student (0% - 49%)", value: 1, max: 75, color: "#2563eb" },
        { label: "Withdrawn Payment (50% - 79%)", value: 40, max: 75, color: "#F68E2D" },
        { label: "Academic Withdrawn (80% - 100%)", value: 75, max: 75, color: "#F68E2D" },
        { label: "Student Output Sucess(80% - 100%)", value: 50, max: 75, color: "#10b981" },
    ];

    return (
        <div className="space-y-6">
            {/* AGENT INFORMATION */}
            <div className="bg-[#181537] rounded-lg p-6">
                <h2 className="text-white text-lg font-semibold mb-4 border-b border-[#23204a] pb-2">
                    {isAgentRequest ? 'AGENT INFORMATION' : ('universityName' in agent ? 'UNIVERSITY INFORMATION' : 'AGENT INFORMATION')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    <div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                {isAgentRequest ? 'Agent Name' : ('universityName' in agent ? 'University Name' : 'First Name')}
                            </span>
                            : {getAgentName()}
                        </div>
                        <div>
                            <span className="font-semibold">Email ID :</span> {getAgentEmail()}
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                {'universityName' in agent ? 'Agent Role' : 'Last Name'}
                            </span>
                            : {getAgentRole()}
                        </div>
                        <div>
                            <span className="font-semibold">
                                {'agentBusinessType' in agent ? 'Business Type' : 'Phone Number'}
                            </span>
                            : {getBusinessType() || (agent as Agent).mobile || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* REQUEST MESSAGE */}
            {'message' in agent && agent.message && (
                <div className="bg-[#181537] rounded-lg p-6">
                    <h2 className="text-white text-lg font-semibold mb-4 border-b border-[#23204a] pb-2">REQUEST MESSAGE</h2>
                    <p className="text-gray-300">{agent.message}</p>
                </div>
            )}

            {/* REVIEW INFORMATION */}
            {'reviewNote' in agent && agent.reviewNote && (
                <div className="bg-[#181537] rounded-lg p-6">
                    <h2 className="text-white text-lg font-semibold mb-4 border-b border-[#23204a] pb-2">REVIEW INFORMATION</h2>
                    <div className="space-y-2 text-gray-300">
                        <div>
                            <span className="font-semibold">Status:</span> {('status' in agent ? agent.status : 'N/A')}
                        </div>
                        <div>
                            <span className="font-semibold">Review Note:</span> {agent.reviewNote}
                        </div>
                        {'reviewedAt' in agent && agent.reviewedAt && (
                            <div>
                                <span className="font-semibold">Reviewed At:</span> {new Date(agent.reviewedAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AGENCY INFORMATION (for old Agent type) */}
            {!('universityName' in agent) && (
                <div className="bg-[#181537] rounded-lg p-6">
                    <h2 className="text-white text-lg font-semibold mb-4 border-b border-[#23204a] pb-2">AGENCY INFORMATION</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                        <div>
                            <div className="mb-2"><span className="font-semibold">Agency Name :</span> {(agent as Agent).agency || 'N/A'}</div>
                            <div><span className="font-semibold">Email ID :</span> {(agent as Agent).email || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="mb-2"><span className="font-semibold">Branch :</span> N/A</div>
                            <div><span className="font-semibold">Phone Number :</span> {(agent as Agent).mobile || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* PERFORMANCE MATRIX */}
            <div className="bg-[#181537] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white text-lg font-semibold">PERFORMANCE MATIX</h2>
                    <button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors">
                        Weekly
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    {performance.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-white text-sm mb-1">
                                <span>{item.label}</span>
                                <span>{String(item.value).padStart(2, "0")}/{item.max}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-2 rounded-full"
                                    style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: item.color }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewAgent;
