// The ONLY place in the frontend that calls fetch.
// Components call `api.*` and never build URLs themselves.
import type {
  CreateRequestInput,
  ServiceRequest,
  Status,
} from "@/features/requests/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    // fetch itself failed: server down, no network, CORS blocked...
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Cannot reach the server. Please try again.",
    );
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? "UNKNOWN",
      body?.error?.message ?? "Something went wrong",
      body?.error?.details,
    );
  }
  return body as T;
}

export const api = {
  listRequests: (status?: Status) =>
    request<ServiceRequest[]>(
      `/api/requests${status ? `?status=${encodeURIComponent(status)}` : ""}`,
    ),
  getRequest: (id: string) =>
    request<ServiceRequest>(`/api/requests/${encodeURIComponent(id)}`),
  createRequest: (input: CreateRequestInput) =>
    request<ServiceRequest>("/api/requests", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateStatus: (id: string, status: Status) =>
    request<ServiceRequest>(`/api/requests/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
