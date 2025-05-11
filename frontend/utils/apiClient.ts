const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export function buildUrl(path: string) {
  return `${API_BASE}${path}`;
}
