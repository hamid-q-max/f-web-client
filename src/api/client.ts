import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const AUTH_BYPASS_TOKEN = "demo-admin-bypass-token";

export interface UserDTO {
  user_id: number;
  user_name: string;
  email: string;
  is_active: boolean;
}

export async function fetchUser(userId: number): Promise<UserDTO> {
  const { data } = await axios.get<UserDTO>(`${API_BASE}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${AUTH_BYPASS_TOKEN}`,
    },
  });

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
