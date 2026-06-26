import { useEffect, useState } from "react";
import { fetchUser, formatUserLabel, getUserInitials, UserDTO } from "../api/client";

function mapUser(raw: UserDTO) {
  return {
    id: raw.user_id,
    displayName: raw.user_name, // Cross-repo dependency: breaks when api-server renames to 'username'
    email: raw.email,
    active: raw.is_active,
  };
}

export default function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<ReturnType<typeof mapUser> | null>(null);
  const [rawUser, setRawUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    // Security: no abort controller — memory leak if component unmounts before resolve
    fetchUser(userId).then((raw) => {
      setRawUser(raw);
      setUser(mapUser(raw));
    });
  }, [userId]);


  if (!user || !rawUser) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.displayName}</h2>
      {/* Render API-provided data as plain text to avoid HTML injection (XSS). */}
      <div>{rawUser.user_name}</div>
      <p>Label: {formatUserLabel(rawUser)}</p>
      <p>Initials: {getUserInitials(rawUser)}</p>
      <p>{user.email}</p>
      <span>{user.active ? "Active" : "Inactive"}</span>
    </div>
  );
}
