export const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://api.vebjornbaustad.no"
    : "http://localhost:5035";

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[apiFetch] API error:', text);
    throw new Error(text || 'API request failed');
  }

  // Only parse as JSON if there's content
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }

  // No JSON to parse, just return ok
  return null;
}
