import { appConfig } from "@/lib/config";
import { clearStoredSession, loadStoredSession } from "@/lib/auth-storage";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const authHeaders: HeadersInit = {};

  if (typeof window !== "undefined") {
    const session = loadStoredSession();
    if (session?.token) {
      authHeaders.Authorization = `Bearer ${session.token}`;
    }
  }

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
    }
    let message = "Request failed";

    try {
      const errorBody = (await response.json()) as {
        message?: string;
        error?: string;
      };
      if (errorBody.message) {
        message = errorBody.message;
      } else if (errorBody.error) {
        message = errorBody.error;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
