import { apiGet, apiPut } from "./apiClient";
import type { AgentRequest, AgentRequestResponse } from "./types";

/**
 * Fetch all agent requests for the university
 * @returns List of agent requests with various statuses
 */
export async function getUniversityAgentRequests(): Promise<AgentRequest[]> {
  return apiGet<AgentRequest[]>("/api/university-requests/university");
}

/**
 * Accept an agent's assignment request
 * @param requestId - The ID of the request to accept
 * @param reviewNote - Optional note explaining the acceptance
 * @returns The updated request object
 */
export async function acceptAgentRequest(
  requestId: string,
  reviewNote?: string
): Promise<AgentRequestResponse> {
  return apiPut<AgentRequestResponse>(
    `/api/university-requests/${requestId}/accept`,
    { reviewNote }
  );
}

/**
 * Reject an agent's assignment request
 * @param requestId - The ID of the request to reject
 * @param reviewNote - Optional note explaining the rejection
 * @returns The updated request object
 */
export async function rejectAgentRequest(
  requestId: string,
  reviewNote?: string
): Promise<AgentRequestResponse> {
  return apiPut<AgentRequestResponse>(
    `/api/university-requests/${requestId}/reject`,
    { reviewNote }
  );
}
