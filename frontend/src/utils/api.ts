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
  let errorMessage = 'API request failed';
  try {
    const errorJson = await res.json();
    errorMessage = errorJson.message || JSON.stringify(errorJson);
  } catch {
    const text = await res.text();
    errorMessage = text || errorMessage;
  }
  console.error('[apiFetch] API error:', errorMessage);
  throw new Error(errorMessage);
}


  // Only parse as JSON if there's content
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }

  // No JSON to parse, just return ok
  return null;
}
