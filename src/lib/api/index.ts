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
} from "./types";
