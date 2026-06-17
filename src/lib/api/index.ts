// src/lib/api/index.ts
// Auth Service
export {
  signup,
  login,
  storeAuthToken,
  storeUserData,
  getAuthToken,
  getStoredUserData,
  removeAuthToken,
  isAuthenticated,
} from "./authService";

// File Service
export { uploadFile, uploadMultipleFiles, getFileDisplayUrl } from "./fileService";

// University Requests Service
export {
  getUniversityAgentRequests,
  acceptAgentRequest,
  rejectAgentRequest,
} from "./universityRequests";

// University Management Service
export { getUniversities } from "./universityManagement";

// CDP Courses Service
export { getCdpCourses } from "./cdpCourses";
export { enrollInCourse, getMyEnrolledCourses, getProgress, updateProgress, getMyStats } from "./cdpService";

// API Client (for authenticated requests)
export { apiRequest, apiGet, apiPost, apiPut, apiDelete } from "./apiClient";

// Types
export type {
  UserRole,
  BusinessType,
  AgentSignupRequest,
  UniversitySignupRequest,
  SignupRequest,
  LoginRequest,
  User,
  SignupResponse,
  LoginResponse,
  ApiErrorResponse,
  AgentRequest,
  AgentRequestResponse,
  AgentRequestStatus,
  AgentRole,
  AgentBusinessType,
  University,
  UniversityListResponse,
  CdpCourse,
  CdpCourseListResponse,
  CdpEnrollment,
  CdpEnrollmentResponse,
  CdpStats,
  EnrolledCourse,
  CourseProgress,
} from "./types";
