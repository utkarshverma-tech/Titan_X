import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

/** Production: set in host (e.g. Vercel) to your API origin, e.g. https://my-api.railway.app — no trailing slash. Local dev: leave unset so Vite `/api` proxy is used. */
const apiOrigin = (import.meta.env.VITE_API_URL?.trim() ?? "").replace(/\/+$/, "");
if (apiOrigin) setBaseUrl(apiOrigin);

createRoot(document.getElementById("root")!).render(<App />);
