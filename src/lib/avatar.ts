const API_URL = import.meta.env.VITE_API_URL!;

/**
 * Resolves an avatar URL to a full URL.
 * Handles multiple formats for backwards compatibility:
 * - Absolute URLs (gravatar, Auth0 CDN, etc.)
 * - Data URIs (base64 encoded images)
 * - Relative paths (from our API)
 */
export function resolveAvatarUrl(url: string | null | undefined): string {
  if (!url) {
    return "https://via.placeholder.com/40"; // Default avatar
  }

  // If it's already an absolute URL (gravatar, Auth0 CDN, etc.), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it's a data URI (base64 encoded), return as-is
  if (url.startsWith("data:")) {
    return url;
  }

  // If it's a relative path, prepend API URL
  return `${API_URL}${url}`;
}
