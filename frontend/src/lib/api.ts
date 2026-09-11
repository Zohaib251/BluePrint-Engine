/**
 * API Client Module.
 *
 * Provides typed fetch wrappers connecting Next.js frontend to FastAPI backend endpoints.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Interface defining User entity returned from backend API.
 */
export interface User {
  id: string;
  username: string;
  role: string;
  generation_count: number;
  created_at: string;
}

/**
 * Interface defining PRD History record returned from backend API.
 */
export interface PRDHistory {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

/**
 * Interface defining Admin Platform Analytics Payload.
 */
export interface AdminAnalytics {
  total_users: number;
  total_prds: number;
  users: User[];
}

/**
 * Interface defining Structured PRD Content parsed from JSON.
 */
export interface PRDStructuredContent {
  title: string;
  architecture_overview: string;
  database_tables: Array<{
    table_name: string;
    description: string;
    columns: Array<{ name: string; type: string; constraints: string }>;
  }>;
  api_routes: Array<{
    method: string;
    path: string;
    summary: string;
  }>;
  mermaid_diagram: string;
}

/**
 * Helper to get authentication token from localStorage.
 */
export function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("blueprint_jwt_token");
  }
  return null;
}

/**
 * Generic fetch wrapper attaching JWT authorization headers.
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected API error occurred.";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Sign up a new user account.
 */
export async function signupUser(username: string, password: string) {
  return fetchWithAuth("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

/**
 * Sign in user and receive JWT access token.
 */
export async function signinUser(username: string, password: string) {
  const res = await fetchWithAuth("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (res.access_token) {
    localStorage.setItem("blueprint_jwt_token", res.access_token);
  }
  return res;
}

/**
 * Get current authenticated user profile details.
 */
export async function getCurrentUser(): Promise<User> {
  return fetchWithAuth("/api/auth/me", { method: "GET" });
}

/**
 * Generate a new PRD using Gemini 1.5 Flash AI.
 */
export async function generatePRD(
  title: string,
  brief: string
): Promise<PRDHistory> {
  return fetchWithAuth("/api/prd/generate", {
    method: "POST",
    body: JSON.stringify({ title, brief }),
  });
}

/**
 * List all PRDs for current authenticated user.
 */
export async function listPRDs(): Promise<PRDHistory[]> {
  return fetchWithAuth("/api/prd", { method: "GET" });
}

/**
 * Get PRD history record by ID.
 */
export async function getPRDById(id: string): Promise<PRDHistory> {
  return fetchWithAuth(`/api/prd/${id}`, { method: "GET" });
}

/**
 * Delete PRD history record by ID.
 */
export async function deletePRDById(id: string): Promise<void> {
  return fetchWithAuth(`/api/prd/${id}`, { method: "DELETE" });
}

/**
 * Retrieve platform analytics metrics (Admin only).
 */
export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  return fetchWithAuth("/api/admin/analytics", { method: "GET" });
}

/**
 * Manually trigger the 30-day data pruning script (Admin only).
 */
export async function triggerManualPruning(): Promise<{ message: string; deleted_count: number }> {
  return fetchWithAuth("/api/admin/prune", { method: "POST" });
}
