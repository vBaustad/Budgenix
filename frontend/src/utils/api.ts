export const API_BASE_URL =
  import.meta.env.MODE === 'production'
    ? 'https://api.vebjornbaustad.no'
    : 'http://localhost:5035';

/**
 * Generic API fetch wrapper
 * Automatically includes credentials, JSON headers, and error handling
 */
export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T | null> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
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

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }

  return null;
}
