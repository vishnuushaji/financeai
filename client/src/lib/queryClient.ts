import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    let message;
    try {
      const json = JSON.parse(text);
      message = json.message || text;
    } catch {
      message = text;
    }
    throw new Error(message);
  }
}

export async function apiRequest(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const token = localStorage.getItem('auth_token');
  const fullUrl = url.startsWith('http') ? url : `/api${url}`;
  
  const res = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: "include",
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  await throwIfResNotOk(res);
  
  // Handle empty responses
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }
  return null;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem('auth_token');
    
    // Fix: Handle queryKey properly
    // If it's an array with a single string, use that string
    // Otherwise, join with "/" but skip empty strings
    let url: string;
    if (Array.isArray(queryKey) && queryKey.length === 1 && typeof queryKey[0] === 'string') {
      url = queryKey[0];
    } else if (Array.isArray(queryKey)) {
      url = queryKey.filter(key => key && typeof key === 'string').join("/");
    } else {
      url = String(queryKey);
    }
    
    // Ensure the URL starts with /api if it doesn't already
    if (!url.startsWith('/api') && !url.startsWith('http')) {
      url = `/api${url}`;
    }
    
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      localStorage.removeItem('auth_token');
      return null;
    }

    if (res.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    await throwIfResNotOk(res);
    
    // Handle empty responses
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return null;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});