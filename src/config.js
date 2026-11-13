// Base URL of the ResolveAI backend.
// Set VITE_API_URL in a .env file at the project root to change it,
// e.g. VITE_API_URL=https://api.example.com (no trailing slash).
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");
