// src/lib/api/authService.ts
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse, ApiErrorResponse, User } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SIGNUP_ENDPOINT = "/auth/signup";
const LOGIN_ENDPOINT = "/auth/login";

type ApiErrorLike = {
  message?: string;
  error?: string;
  errors?: unknown;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => "");
}

function extractApiErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string") {
    const trimmed = body.trim();
    return trimmed || fallback;
  }

  if (body && typeof body === "object") {
    const apiError = body as ApiErrorLike;
    if (typeof apiError.message === "string" && apiError.message.trim()) {
      return apiError.message;
    }
    if (typeof apiError.error === "string" && apiError.error.trim()) {
      return apiError.error;
    }
    if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
      const firstError = apiError.errors[0];
      if (typeof firstError === "string" && firstError.trim()) {
        return firstError;
      }
      if (firstError && typeof firstError === "object" && "message" in firstError) {
        const msg = (firstError as { message?: unknown }).message;
        if (typeof msg === "string" && msg.trim()) {
          return msg;
        }
      }
    }
  }

  return fallback;
}

/**
 * Handles user signup (both agent and university)
 * @param signupData - The signup request data
 * @returns The signup response with token and user data
 */
export async function signup(signupData: SignupRequest): Promise<SignupResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured in environment variables");
  }

  const url = `${API_BASE_URL}${SIGNUP_ENDPOINT}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      const fallback = `Signup failed with status ${response.status}`;
      throw new Error(extractApiErrorMessage(data, fallback));
    }

    return data as SignupResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during signup");
  }
}

/**
 * Handles user login (both agent and university)
 * @param loginData - The login request data (email and password)
 * @returns The login response with token and user data
 */
export async function login(loginData: LoginRequest): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured in environment variables");
  }

  const url = `${API_BASE_URL}${LOGIN_ENDPOINT}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      const fallback = `Login failed with status ${response.status}`;
      throw new Error(extractApiErrorMessage(data, fallback));
    }

    return data as LoginResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during login");
  }
}

/**
 * Stores authentication token in localStorage
 * @param token - The JWT token from signup/login response
 */
export function storeAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

/**
 * Stores the authenticated user payload in localStorage
 */
export function storeUserData(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("userRole", user.role);
  }
}

/**
 * Retrieves authentication token from localStorage
 * @returns The stored JWT token or null
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

/**
 * Reads the stored user payload from localStorage
 */
export function getStoredUserData(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("userData");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * Removes authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

/**
 * Checks if user is authenticated
 * @returns True if auth token exists
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
