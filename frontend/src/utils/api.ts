interface FetchOptions extends RequestInit {
  responseType?: 'json' | 'blob';
}

export async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const url = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
    : `http://localhost:8000${endpoint}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: any = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // Prevent fetch from failing multipart boundary generation
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed with status ${response.status}`);
  }

  if (options.responseType === 'blob') {
    return response.blob();
  }

  return response.json();
}
