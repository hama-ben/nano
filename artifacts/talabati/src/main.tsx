import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setDeviceIdGetter, setTokenRefresher } from "@workspace/api-client-react";
import { getDeviceId } from "@/lib/device-id";
import { tokenRefresher } from "@/lib/token-refresh";

// The Replit deployment serves the API and the built frontend from the same
// origin (see artifacts/api-server/src/app.ts), so by default we make
// relative "/api/..." requests (setBaseUrl(null)).
//
// VITE_API_BASE_URL overrides this at build time for setups where the
// frontend is NOT served from the same origin as the API — e.g. the
// Capacitor/Android WebView build (see ANDROID_BUILD.md), which cannot use
// relative URLs and must point at the full deployed API URL.
//
// NOTE: previously this fell back to a hardcoded Render URL
// ("https://mizu-nyv1.onrender.com") whenever VITE_API_BASE_URL was unset.
// That Render service is dead (404s on every route) and was silently
// hijacking every web request whenever the Replit deployment build didn't
// set the env var, producing a raw "Failed to fetch" with no server-side
// trace. Do NOT reintroduce a hardcoded remote fallback here.
const apiBase =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || null;
setBaseUrl(apiBase);

setDeviceIdGetter(getDeviceId);

// On every 401 response, customFetch will call tokenRefresher() to exchange
// the expired access token for a fresh one (via POST /api/auth/refresh) and
// then automatically retry the failed request with the new token.
setTokenRefresher(tokenRefresher);

createRoot(document.getElementById("root")!).render(<App />);
