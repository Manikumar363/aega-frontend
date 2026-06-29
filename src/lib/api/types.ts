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
  universityName: string;
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
  universityName?: string;
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

// University Agent Requests Types
export type AgentRequestStatus = "pending" | "accepted" | "rejected";
export type AgentRole = "counsellor" | "agent";
export type AgentBusinessType = "recruitment" | "education_consultancy";

export interface AgentRequest {
  _id: string;
  agentId: string | {
    _id: string;
    name: string;
    email: string;
    role: string;
    businessType?: string;
  };
  agentRole: AgentRole;
  agentBusinessType: AgentBusinessType;
  universityId: string;
  universityName: string;
  universityEmail: string;
  message: string;
  status: AgentRequestStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  agentProfile?: {
    id: string;
    complianceScore: number;
    numberOfAudits: number;
    activeAlerts: number;
    riskLevel: string;
  } | null;
}

export interface AgentRequestResponse {
  message: string;
  request: AgentRequest;
}

// University Management Types
export interface University {
  id: string;
  name: string;
  mobile: string;
  email: string;
  location: string;
  shortCode: string;
  logoColor: string;
  verified: "green" | "yellow";
  online: boolean;
}

export interface UniversityListResponse {
  message?: string;
  data?: University[];
  universities?: University[];
}

// CDP Course Types
export interface CdpCourse {
  id: string;
  _id?: string;
  courseName: string;
  type: "mandatory" | "optional" | string;
  timeInHr: number;
  modules: number;
  hyperLink?: string;
  description?: string;
  coverPicture?: string;
  registered?: boolean;
  registrationNote?: string;
  registrationStartDate?: string;
  enrollmentStatus?: "on-going" | "completed" | "due" | string;
  createdBy?: string;
  createdAt?: string;
  __v?: number;
}

export type CdpCourseListResponse = CdpCourse[] | { data?: CdpCourse[] } | { courses?: CdpCourse[] };

// Enrollment / Progress Types
export interface CdpEnrollment {
  _id: string;
  userId?: string;
  courseId: CdpCourse | { _id: string; courseName: string; type?: string; timeInHr?: number; modules?: number; description?: string };
  enrollmentDate?: string;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  status?: "on-going" | "completed" | "due" | string;
  certificateUrl?: string;
  completionDate?: string;
  progress?: number;
  updatedAt?: string;
}

export interface CdpEnrollmentResponse {
  success?: boolean;
  message?: string;
  data?: CdpEnrollment;
}

export interface CdpStats {
  total: number;
  completed: number;
  ongoing?: number;
  "on-going"?: number;
  due?: number;
}

export interface EnrolledCourse {
  progressId?: string;
  courseId?: string;
  course?: CdpCourse;
  status?: "on-going" | "completed" | "due" | string;
  startDate?: string;
  notes?: string;
  certificateUrl?: string;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseProgress {
  id?: string;
  progressId?: string;
  courseId?: string;
  status?: string;
  startDate?: string;
  notes?: string;
  certificateUrl?: string;
  progressData?: any;
  createdAt?: string;
  updatedAt?: string;
}

