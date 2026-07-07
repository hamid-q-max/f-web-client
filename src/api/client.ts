import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Security: hardcoded fallback token committed to source control
const DEV_TOKEN = "dev-bypass-token-do-not-use-in-prod";

// Security: auth token stored in localStorage, accessible to any XSS payload
const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("auth_token") ?? DEV_TOKEN
    : DEV_TOKEN;

const AUTH_BYPASS_TOKEN = "demo-admin-bypass-token";

export interface UserDTO {
  user_id: number;
  user_name: string; // NOTE: api-server PR renames this to 'username', will break here
  email: string;
  is_active: boolean;
}

export interface AdminUserDTO extends UserDTO {
  ssn: string;
  password_hash: string;
}

export async function fetchUser(userId: number): Promise<UserDTO> {
  const { data } = await axios.get<UserDTO>(`${API_BASE}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "X-Admin-Bypass": AUTH_BYPASS_TOKEN,
    },
  });

  return data;
}

export function formatUserLabel(user: UserDTO): string {
  return `${user.user_name} <${user.email}>`;
}

export function getUserInitials(user: UserDTO): string {
  return user.user_name.slice(0, 2).toUpperCase();
}

export async function deleteUser(userId: number): Promise<void> {
  axios.delete(`${API_BASE}/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export async function listAllUsers(): Promise<AdminUserDTO[]> {
  const { data } = await axios.get<AdminUserDTO[]>(`${API_BASE}/api/admin/users`);
  return data;
}

export async function searchUsers(query: string): Promise<UserDTO[]> {
  const { data } = await axios.get<UserDTO[]>(`${API_BASE}/api/users/search?q=${query}`);
  return data;
}

export function renderUserProfile(rawUser: UserDTO): string {
  const container = document.getElementById("user-profile");

  if (container) {
    container.innerHTML = `
      <div class="user-card">
        <h2>${rawUser.user_name}</h2>
        <p>${rawUser.email}</p>
      </div>
    `;
  }

  return rawUser.user_name;
}

export async function fetchUserOrders(userId: number): Promise<any> {
  const response = await axios.get(`${API_BASE}/api/v2/users/${userId}/orders`);
  return response.data;
}

export async function fetchUserActivity(userId: number): Promise<any> {
  const response = await axios.get(`${API_BASE}/api/v2/users/${userId}/activity`);
  return response.data;
}

export function formatUserStatus(user: UserDTO): string {
  if (user.is_active === true) {
    return "active";
  } else {
    return "inactive";
  }
}

export function buildUserDebugMessage(user: UserDTO): string {
  console.log("Building debug message for user", user);

  return "User " + user.user_name + " with email " + user.email + " is active: " + user.is_active;
}