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

export interface ScopeMatrixItem {
  feature: string;
  scope: string;
  priority: string;
  details: string;
}

export interface UserStoryItem {
  user_type: string;
  action: string;
  value: string;
  acceptance_criteria: string[];
}

export interface Module1PRD {
  executive_summary: string;
  scope_matrix: ScopeMatrixItem[];
  user_stories: UserStoryItem[];
}

export interface Module2Infrastructure {
  hosting_architecture: string;
  hosting_rationale: string;
  caching_cdn_strategy: string;
  availability_and_safety: string;
}

export interface CostEstimateItem {
  category: string;
  service_or_tool: string;
  estimated_monthly_cost: string;
}

export interface Module3TechStack {
  frontend_technology: string;
  backend_technology: string;
  database_technology: string;
  third_party_tools: string;
  cost_table: CostEstimateItem[];
  total_monthly_estimate: string;
}

export interface SitemapRouteItem {
  page_name: string;
  route_path: string;
  access_level: string;
  key_components: string;
}

export interface DatabaseTableColumn {
  name: string;
  type: string;
  constraints: string;
}

export interface DatabaseTableSchema {
  table_name: string;
  description: string;
  columns: DatabaseTableColumn[];
}

export interface APIRouteSchema {
  method: string;
  path: string;
  summary: string;
}

export interface Module4DataArchitecture {
  sitemap_tree: SitemapRouteItem[];
  database_tables: DatabaseTableSchema[];
  api_routes: APIRouteSchema[];
  mermaid_diagram: string;
}

export interface MilestonePhase {
  phase_number: number;
  phase_name: string;
  execution_tasks: string[];
}

export interface Module5Runbook {
  milestones: MilestonePhase[];
}

/**
 * Interface defining Master Blueprint Structured Content parsed from JSON.
 */
export interface PRDStructuredContent {
  title: string;
  module_1_prd?: Module1PRD;
  module_2_infrastructure?: Module2Infrastructure;
  module_3_tech_stack?: Module3TechStack;
  module_4_data_architecture?: Module4DataArchitecture;
  module_5_runbook?: Module5Runbook;

  // Legacy fallback fields
  architecture_overview?: string;
  database_tables?: DatabaseTableSchema[];
  api_routes?: APIRouteSchema[];
  mermaid_diagram?: string;
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
    const error: any = new Error(errorDetail);
    error.status = response.status;
    throw error;
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
 * Generate a new Master Blueprint using Gemini AI.
 */
export async function generatePRD(
  title: string,
  brief: string,
  price_range?: string,
  traffic_range?: string
): Promise<PRDHistory> {
  return fetchWithAuth("/api/prd/generate", {
    method: "POST",
    body: JSON.stringify({
      title,
      brief,
      price_range: price_range || "Low / Bootstrap ($0 - $50/mo)",
      traffic_range: traffic_range || "MVP / Growth (< 10,000 MAU)",
    }),
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
