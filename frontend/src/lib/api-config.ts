/** Base URL del backend FastAPI (Railway o local). Sin barra final. */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
