import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

function getAuthHeaders() {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication token is required");
  }
  return { Authorization: `Bearer ${token}` };
}

export interface UserDTO {
  user_id: number;
  user_name: string; // NOTE: api-server PR renames this to 'username' — will break here
  email: string;
  is_active: boolean;
}

export type AdminUserDTO = UserDTO;

export async function fetchUser(userId: number): Promise<UserDTO> {
  const { data } = await axios.get<UserDTO>(`${API_BASE}/api/users/${userId}`, {
    headers: getAuthHeaders(),
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
