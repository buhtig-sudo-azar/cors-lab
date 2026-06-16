/**
 * CORS Configuration Library
 *
 * Implements two modes:
 * 1. VULNERABLE — reflects any Origin back in ACAO header (basic origin reflection vulnerability)
 * 2. SAFE — uses a whitelist of allowed origins
 *
 * This is an EDUCATIONAL demonstration. Never use the vulnerable mode in production.
 */

/** Allowed origins for safe mode */
const ALLOWED_ORIGINS: string[] = [
  "http://localhost:3000",
  "https://cors-lab.vercel.app",
];

/**
 * Global mode state — persisted on globalThis to survive Next.js
 * hot-module replacement (each HMR cycle creates a fresh module scope,
 * so a plain `let` would reset to "vulnerable" every time).
 */
const globalForCors = globalThis as unknown as {
  __corsMode?: "vulnerable" | "safe";
};

if (!globalForCors.__corsMode) {
  globalForCors.__corsMode = "vulnerable";
}

export function getCorsMode(): "vulnerable" | "safe" {
  return globalForCors.__corsMode!;
}

export function setCorsMode(mode: "vulnerable" | "safe"): void {
  globalForCors.__corsMode = mode;
}

export interface CorsResult {
  allowed: boolean;
  origin: string | null;
  accessControlAllowOrigin: string | null;
  accessControlAllowCredentials: string | null;
  mode: "vulnerable" | "safe";
  reason: string;
}

/**
 * Evaluates CORS policy based on the current mode and the incoming Origin.
 * Returns headers to set on the response and diagnostic information.
 */
export function evaluateCors(origin: string | null): CorsResult {
  // No origin — same-origin request or non-browser client
  if (!origin) {
    return {
      allowed: true,
      origin: null,
      accessControlAllowOrigin: null,
      accessControlAllowCredentials: null,
      mode: getCorsMode(),
      reason: "Запрос без заголовка Origin (same-origin или не из браузера). CORS не применяется.",
    };
  }

  if (getCorsMode() === "vulnerable") {
    // VULNERABLE: reflect any Origin without validation
    return {
      allowed: true,
      origin,
      accessControlAllowOrigin: origin,
      accessControlAllowCredentials: "true",
      mode: "vulnerable",
      reason: `УЯЗВИМЫЙ РЕЖИМ: Origin «${origin}» скопирован в Access-Control-Allow-Origin без проверки. Доступ разрешён.`,
    };
  }

  // SAFE: check whitelist
  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      allowed: true,
      origin,
      accessControlAllowOrigin: origin,
      accessControlAllowCredentials: "true",
      mode: "safe",
      reason: `БЕЗОПАСНЫЙ РЕЖИМ: Origin «${origin}» находится в белом списке. Доступ разрешён.`,
    };
  }

  return {
    allowed: false,
    origin,
    accessControlAllowOrigin: null,
    accessControlAllowCredentials: null,
    mode: "safe",
    reason: `БЕЗОПАСНЫЙ РЕЖИМ: Origin «${origin}» отсутствует в белом списке. Доступ ЗАПРЕЩЁН.`,
  };
}

/**
 * Applies CORS headers to a Next.js Response based on evaluation result.
 */
export function applyCorsHeaders(
  response: Response,
  result: CorsResult
): void {
  if (result.accessControlAllowOrigin) {
    response.headers.set(
      "Access-Control-Allow-Origin",
      result.accessControlAllowOrigin
    );
  }
  if (result.accessControlAllowCredentials) {
    response.headers.set(
      "Access-Control-Allow-Credentials",
      result.accessControlAllowCredentials
    );
  }
}

/**
 * Returns the list of allowed origins (for display purposes).
 */
export function getAllowedOrigins(): string[] {
  return [...ALLOWED_ORIGINS];
}
