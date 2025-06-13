export const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://api.vebjornbaustad.no"
    : "http://localhost:5035";

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include", // beholder cookies (JWT)
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "API request failed");
  }

  return res.json();
}
