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
  requestPasswordReset,
  verifyOtp,
  resetPassword,
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
export { getUniversities, deleteUniversity, updateUniversity } from "./universityManagement";

// CDP Courses Service
export { getCdpCourses } from "./cdpCourses";
export { enrollInCourse, getMyEnrolledCourses, getProgress, updateProgress, updateCourseSchedule, getMyStats } from "./cdpService";

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
