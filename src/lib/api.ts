/**
 * API Service Layer
 * 
 * TODO: Replace these placeholder functions with actual MySQL API calls.
 * Each function currently returns mock/empty data.
 * 
 * Example usage after connecting your API:
 *   const response = await fetch('https://your-api.com/profiles', { ... });
 *   return response.json();
 */

const API_BASE = ""; // TODO: Set your MySQL API base URL

// Generic fetch wrapper — customize headers, auth tokens, etc.
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<{ data: T | null; error: any }> {
  if (!API_BASE) {
    console.warn(`[API] No API_BASE configured. Call to ${endpoint} returned empty data.`);
    return { data: null, error: null };
  }
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    console.error(`[API] Error fetching ${endpoint}:`, error);
    return { data: null, error };
  }
}

// ==================== AUTH ====================

export const authApi = {
  signInWithPassword: async (email: string, password: string) => {
    // TODO: POST /auth/login { email, password }
    return apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  },
  signUp: async (email: string, password: string, metadata?: { full_name?: string }) => {
    // TODO: POST /auth/register { email, password, full_name }
    return apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ email, password, ...metadata }) });
  },
  signOut: async () => {
    // TODO: POST /auth/logout
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_session");
  },
  getSession: async () => {
    const user = localStorage.getItem("auth_user");
    return { session: user ? JSON.parse(user) : null };
  },
  resetPasswordForEmail: async (email: string) => {
    // TODO: POST /auth/reset-password { email }
    return apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify({ email }) });
  },
};

// ==================== DATABASE ====================

export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    return apiFetch(`/profiles?user_id=${userId}`);
  },
  updateProfile: async (userId: string, updates: any) => {
    return apiFetch(`/profiles/${userId}`, { method: "PATCH", body: JSON.stringify(updates) });
  },
  getAllProfiles: async () => {
    return apiFetch<any[]>("/profiles");
  },

  // User roles
  getUserRole: async (userId: string, role: string) => {
    return apiFetch(`/user-roles?user_id=${userId}&role=${role}`);
  },

  // Tasks
  getActiveTasks: async () => {
    return apiFetch<any[]>("/tasks?status=active");
  },
  getTask: async (id: string) => {
    return apiFetch(`/tasks/${id}`);
  },
  getAllTasks: async () => {
    return apiFetch<any[]>("/tasks");
  },
  createTask: async (task: any) => {
    return apiFetch("/tasks", { method: "POST", body: JSON.stringify(task) });
  },
  updateTask: async (id: string, updates: any) => {
    return apiFetch(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
  },
  deleteTask: async (id: string) => {
    return apiFetch(`/tasks/${id}`, { method: "DELETE" });
  },

  // Task categories
  getCategories: async () => {
    return apiFetch<any[]>("/task-categories");
  },
  createCategory: async (category: any) => {
    return apiFetch("/task-categories", { method: "POST", body: JSON.stringify(category) });
  },
  deleteCategory: async (id: string) => {
    return apiFetch(`/task-categories/${id}`, { method: "DELETE" });
  },

  // User tasks
  getUserTasks: async (userId: string, statuses?: string[]) => {
    const params = statuses ? `&status=${statuses.join(",")}` : "";
    return apiFetch<any[]>(`/user-tasks?user_id=${userId}${params}`);
  },
  createUserTask: async (data: any) => {
    return apiFetch("/user-tasks", { method: "POST", body: JSON.stringify(data) });
  },
  updateUserTask: async (id: string, updates: any) => {
    return apiFetch(`/user-tasks/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
  },
  getAllUserTasks: async () => {
    return apiFetch<any[]>("/user-tasks");
  },

  // Notifications
  getNotifications: async (userId: string) => {
    return apiFetch<any[]>(`/notifications?user_id=${userId}`);
  },
  updateNotification: async (id: string, updates: any) => {
    return apiFetch(`/notifications/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
  },
  updateNotifications: async (ids: string[], updates: any) => {
    return apiFetch("/notifications/bulk-update", { method: "PATCH", body: JSON.stringify({ ids, ...updates }) });
  },
  createNotification: async (data: any) => {
    return apiFetch("/notifications", { method: "POST", body: JSON.stringify(data) });
  },
  createNotifications: async (data: any[]) => {
    return apiFetch("/notifications/bulk", { method: "POST", body: JSON.stringify(data) });
  },
  deleteNotifications: async (userId: string) => {
    return apiFetch(`/notifications?user_id=${userId}`, { method: "DELETE" });
  },
  getAllNotifications: async () => {
    return apiFetch<any[]>("/notifications");
  },

  // Payments
  getPayments: async (userId: string) => {
    return apiFetch<any[]>(`/payments?user_id=${userId}`);
  },
  getAllPayments: async () => {
    return apiFetch<any[]>("/payments");
  },
  createPayment: async (data: any) => {
    return apiFetch("/payments", { method: "POST", body: JSON.stringify(data) });
  },
  updatePayment: async (id: string, updates: any) => {
    return apiFetch(`/payments/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
  },
  deletePayment: async (id: string) => {
    return apiFetch(`/payments/${id}`, { method: "DELETE" });
  },

  // Referrals
  getReferrals: async (referrerId: string) => {
    return apiFetch<any[]>(`/referrals?referrer_id=${referrerId}`);
  },
  getAllReferrals: async () => {
    return apiFetch<any[]>("/referrals");
  },
  createReferral: async (data: any) => {
    return apiFetch("/referrals", { method: "POST", body: JSON.stringify(data) });
  },

  // Reports
  getReports: async (userId: string) => {
    return apiFetch<any[]>(`/reports?user_id=${userId}`);
  },
  getAllReports: async () => {
    return apiFetch<any[]>("/reports");
  },
  createReport: async (data: any) => {
    return apiFetch("/reports", { method: "POST", body: JSON.stringify(data) });
  },
  updateReport: async (id: string, updates: any) => {
    return apiFetch(`/reports/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
  },

  // User requisites
  getRequisites: async (userId: string) => {
    return apiFetch<any[]>(`/user-requisites?user_id=${userId}`);
  },
  getAllRequisites: async () => {
    return apiFetch<any[]>("/user-requisites");
  },
  upsertRequisite: async (data: any) => {
    return apiFetch("/user-requisites", { method: "PUT", body: JSON.stringify(data) });
  },

  // Platform settings
  getSetting: async (key: string) => {
    return apiFetch(`/platform-settings?key=${key}`);
  },
  getAllSettings: async () => {
    return apiFetch<any[]>("/platform-settings");
  },
  updateSetting: async (key: string, value: string) => {
    return apiFetch(`/platform-settings/${key}`, { method: "PATCH", body: JSON.stringify({ value }) });
  },

  // Security logs
  createLog: async (data: any) => {
    return apiFetch("/security-logs", { method: "POST", body: JSON.stringify(data) });
  },
  getLogs: async () => {
    return apiFetch<any[]>("/security-logs?limit=50");
  },

  // News
  getPublishedNews: async () => {
    return apiFetch<any[]>("/news?is_published=true");
  },
  getAllNews: async () => {
    return apiFetch<any[]>("/news");
  },
  createNews: async (data: any) => {
    return apiFetch("/news", { method: "POST", body: JSON.stringify(data) });
  },
  updateNews: async (id: string, updates: any) => {
    return apiFetch(`/news/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
  },
  deleteNews: async (id: string) => {
    return apiFetch(`/news/${id}`, { method: "DELETE" });
  },

  // Banners
  getAllBanners: async () => {
    return apiFetch<any[]>("/banners");
  },
  createBanner: async (data: any) => {
    return apiFetch("/banners", { method: "POST", body: JSON.stringify(data) });
  },
  updateBanner: async (id: string, updates: any) => {
    return apiFetch(`/banners/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
  },
  deleteBanner: async (id: string) => {
    return apiFetch(`/banners/${id}`, { method: "DELETE" });
  },

  // Verification requests
  getVerificationRequests: async (userId?: string) => {
    const params = userId ? `?user_id=${userId}` : "";
    return apiFetch<any[]>(`/verification-requests${params}`);
  },
  createVerificationRequest: async (data: any) => {
    return apiFetch("/verification-requests", { method: "POST", body: JSON.stringify(data) });
  },

  // Team members
  getTeamMembers: async () => {
    return apiFetch<any[]>("/team-members");
  },
  createTeamMember: async (data: any) => {
    return apiFetch("/team-members", { method: "POST", body: JSON.stringify(data) });
  },
  deleteTeamMember: async (id: string) => {
    return apiFetch(`/team-members/${id}`, { method: "DELETE" });
  },
};

// ==================== STORAGE ====================

export const storage = {
  upload: async (bucket: string, path: string, file: File) => {
    // TODO: POST /storage/upload with multipart form data
    console.warn(`[Storage] Upload to ${bucket}/${path} — not connected`);
    return { data: null, error: { message: "Storage not connected" } };
  },
  getPublicUrl: (bucket: string, path: string) => {
    // TODO: Return actual URL from your storage service
    return `${API_BASE}/storage/${bucket}/${path}`;
  },
};

// ==================== SUPABASE COMPATIBILITY SHIM ====================
// This provides a supabase-like interface so large files (Admin.tsx) work without full rewrite.
// TODO: Remove this shim once you migrate Admin.tsx to use db.* methods directly.

class QueryBuilder {
  private table: string;
  private filters: Record<string, any> = {};
  private _order: any = null;
  private _limit: number | null = null;
  private _select: string = "*";
  private _method: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private _body: any = null;
  private _upsertOptions: any = null;

  constructor(table: string) { this.table = table; }

  select(fields: string = "*") { this._method = "select"; this._select = fields; return this; }
  insert(data: any) { this._method = "insert"; this._body = data; return this; }
  update(data: any) { this._method = "update"; this._body = data; return this; }
  delete() { this._method = "delete"; return this; }
  upsert(data: any, options?: any) { this._method = "upsert"; this._body = data; this._upsertOptions = options; return this; }
  eq(col: string, val: any) { this.filters[col] = val; return this; }
  in(col: string, vals: any[]) { this.filters[`${col}__in`] = vals; return this; }
  order(col: string, opts?: any) { this._order = { col, ...opts }; return this; }
  limit(n: number) { this._limit = n; return this; }
  single() { return this.then((r: any) => ({ data: r.data?.[0] || r.data, error: r.error })); }
  maybeSingle() { return this.single(); }

  async then(resolve: (value: any) => any, reject?: (reason: any) => any): Promise<any> {
    console.warn(`[Shim] supabase.from("${this.table}").${this._method}() — not connected to API`);
    const result = { data: this._method === "select" ? [] : this._body, error: null };
    return resolve ? resolve(result) : result;
  }
}

export const supabase = {
  from: (table: string) => new QueryBuilder(table),
  auth: {
    signInWithPassword: async (creds: any) => authApi.signInWithPassword(creds.email, creds.password),
    signUp: async (opts: any) => authApi.signUp(opts.email, opts.password, opts.options?.data),
    signOut: async () => authApi.signOut(),
    getSession: async () => ({ data: { session: await authApi.getSession().then(s => s.session) } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    resetPasswordForEmail: async (email: string, opts?: any) => authApi.resetPasswordForEmail(email),
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => storage.upload(bucket, path, file),
      getPublicUrl: (path: string) => ({ data: { publicUrl: storage.getPublicUrl(bucket, path) } }),
    }),
  },
};
