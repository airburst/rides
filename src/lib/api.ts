const API_URL = import.meta.env.VITE_API_URL!;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = fetchOptions.headers || {};

  // Only set Content-Type if not already set and body is not FormData
  if (
    !Object.keys(headers).some((k) => k.toLowerCase() === "content-type") &&
    !(fetchOptions.body instanceof FormData)
  ) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new ApiError(response.status, error.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}
