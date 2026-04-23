// src/lib/api/types.ts

export type UserRole = "agent" | "university";
export type BusinessType = "b2b" | "b2c" | null;

// Signup Request Types
export interface AgentSignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "agent";
  businessType: "b2b" | "b2c";
  supportingDocument1: string;
  supportingDocument2: string;
}

export interface UniversitySignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "university";
  supportingDocument1: string;
  supportingDocument2: string;
}

export type SignupRequest = AgentSignupRequest | UniversitySignupRequest;

// User Type
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  businessType?: BusinessType;
  supportingDocuments?: string[];
}

// Signup Response Types
export interface SignupResponse {
  message: string;
  token: string;
  user: User;
}

// Login Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

// Login Response Types
export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

// API Error Response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
