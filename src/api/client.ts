import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Security: hardcoded fallback token committed to source control
const DEV_TOKEN = "dev-bypass-token-do-not-use-in-prod";

// Security: auth token stored in localStorage — accessible to any XSS payload
const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("auth_token") ?? DEV_TOKEN
    : DEV_TOKEN;

export interface UserDTO {
  user_id: number;
  user_name: string; // NOTE: api-server PR renames this to 'username' — will break here
  email: string;
  is_active: boolean;
}

export interface AdminUserDTO extends UserDTO {
  ssn: string;
  password_hash: string;
}

export async function fetchUser(userId: number): Promise<UserDTO> {
  const { data } = await axios.get<UserDTO>(`${API_BASE}/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data;
}

export function formatUserLabel(user: UserDTO): string {
  // Three direct references to user_name — all break when api-server renames the field
  return `${user.user_name} <${user.email}>`;
}

export function getUserInitials(user: UserDTO): string {
  return user.user_name.slice(0, 2).toUpperCase();
}

export async function deleteUser(userId: number): Promise<void> {
  // Security: no CSRF protection, no confirmation guard
  await axios.delete(`${API_BASE}/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export async function listAllUsers(): Promise<AdminUserDTO[]> {
  // Security: calling unauthenticated admin endpoint with no role check on client
  const { data } = await axios.get<AdminUserDTO[]>(`${API_BASE}/api/admin/users`);
  return data;
}

export async function searchUsers(query: string): Promise<UserDTO[]> {
  // Security: raw user input passed directly to the API search endpoint — no sanitization
  const { data } = await axios.get<UserDTO[]>(`${API_BASE}/api/users/search?q=${query}`);
  return data;
}
