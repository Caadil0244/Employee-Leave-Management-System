import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface User {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  telephone: string;
  department: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
}

export interface Leave {
  id: number;
  user_id: number;
  user_name?: string;
  employee_id?: string;
  department?: string;
  start_date: string;
  end_date: string;
  leave_type: "SANADLE" | "XANUUN" | "WAX_KALE";
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approved_by?: number;
  approver_name?: string;
  duration_days: number;
  created_at: string;
}

export const LEAVE_TYPE_LABELS: Record<string, string> = {
  SANADLE: "Sanadle (Annual)",
  XANUUN: "Xanuun (Sick)",
  WAX_KALE: "Wax kale (Other)",
};

export const DEPARTMENTS = [
  "Administration",
  "Human Resources",
  "IT",
  "Finance",
  "Operations",
  "Sales",
  "Marketing",
  "General",
];

export interface DashboardStats {
  total_employees: number;
  total_leaves: number;
  pending_leaves: number;
  approved_leaves: number;
  rejected_leaves: number;
}

export const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@elms.com", password: "admin123" },
  { role: "Manager", email: "manager@elms.com", password: "manager123" },
  { role: "Employee", email: "employee@elms.com", password: "employee123" },
];

export const authApi = {
  register: (data: {
    employee_id?: string;
    name: string;
    email: string;
    telephone: string;
    department: string;
    password: string;
  }) => api.post<User>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<{ access_token: string }>("/auth/login", data),
  profile: () => api.get<User>("/auth/profile"),
};

export const employeeApi = {
  list: () => api.get<User[]>("/employees"),
  create: (data: {
    employee_id?: string;
    name: string;
    email: string;
    telephone: string;
    department: string;
    password: string;
    role: string;
  }) => api.post<User>("/employees", data),
  update: (
    id: number,
    data: Partial<{
      employee_id: string;
      name: string;
      email: string;
      telephone: string;
      department: string;
      password: string;
      role: string;
    }>
  ) => api.put<User>(`/employees/${id}`, data),
  delete: (id: number) => api.delete(`/employees/${id}`),
};

export const leaveApi = {
  create: (data: {
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
  }) => api.post<Leave>("/leaves", data),
  my: () => api.get<Leave[]>("/leaves/my"),
  all: () => api.get<Leave[]>("/leaves/all"),
  update: (
    id: number,
    data: Partial<{
      start_date: string;
      end_date: string;
      leave_type: string;
      reason: string;
    }>
  ) => api.put<Leave>(`/leaves/${id}`, data),
  delete: (id: number) => api.delete(`/leaves/${id}`),
  approve: (id: number) => api.put<Leave>(`/leaves/${id}/approve`),
  reject: (id: number) => api.put<Leave>(`/leaves/${id}/reject`),
  stats: () => api.get<DashboardStats>("/leaves/stats"),
};

export default api;
