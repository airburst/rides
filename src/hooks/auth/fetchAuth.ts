import { env } from "@/env";
import { ApiError } from "@/lib/api";

const API_URL = env.VITE_API_URL!;
const AUTH_CALLBACK_URL = env.VITE_AUTH_CALLBACK_URL;
const AUTH_CALLBACK_ORIGIN = AUTH_CALLBACK_URL
  ? new URL(AUTH_CALLBACK_URL).origin
  : undefined;

type ParsedErrorBody = {
  code?: string;
  message?: string;
  error?: string | { code?: string; message?: string };
};

function extractHeaders(headers?: HeadersInit): Headers {
  return new Headers(headers);
}

export async function fetchAuthJson<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = extractHeaders(options.headers);

  if (AUTH_CALLBACK_ORIGIN) {
    headers.set("X-Auth-Origin", AUTH_CALLBACK_ORIGIN);
    try {
      headers.set("Origin", AUTH_CALLBACK_ORIGIN);
    } catch {
      // Browsers may block explicit Origin header assignment.
    }
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const parsed = (data ?? {}) as ParsedErrorBody;
    const code =
      parsed.code ??
      (typeof parsed.error === "object" ? parsed.error.code : undefined);
    const message =
      parsed.message ??
      (typeof parsed.error === "string"
        ? parsed.error
        : parsed.error?.message) ??
      "Request failed";

    throw new ApiError(response.status, code ?? message, parsed);
  }

  return data as T;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
