import { NextRequest, NextResponse } from "next/server";
import {
  evaluateCors,
  applyCorsHeaders,
  getCorsMode,
} from "@/lib/cors";
import { cookies } from "next/headers";

/**
 * GET /api/account
 *
 * Returns sensitive account data (simulated).
 * This endpoint demonstrates the danger of combining
 * Access-Control-Allow-Credentials: true with origin reflection.
 *
 * Uses a simulated cookie-session for educational purposes.
 */
export async function GET(request: NextRequest) {
  // Support simulated cross-origin requests for the attacker page demo.
  // In a real attack the browser would send Origin automatically, but since
  // both pages share the same origin we use a custom header to simulate it.
  const simulatedOrigin = request.headers.get("x-simulated-origin");
  const origin = simulatedOrigin || request.headers.get("origin");
  const corsResult = evaluateCors(origin);

  // Simulated session check — in a real app, this would validate a session cookie
  // For the lab, we always treat the user as "logged in"
  const cookieStore = await cookies();
  let isLoggedIn = cookieStore.get("session")?.value === "active";

  // Auto-set session cookie for demo purposes
  if (!isLoggedIn) {
    isLoggedIn = true; // Treat as logged in for the demo
  }

  const accountData = {
    username: "student",
    email: "student@example.local",
    accessLevel: "user",
    balance: "12 450.00 ₽",
    accountNumber: "RU-DEMO-0000123456",
    lastLogin: "2026-06-16T10:30:00Z",
  };

  const responseData = {
    data: corsResult.allowed && isLoggedIn ? accountData : null,
    cors: {
      mode: corsResult.mode,
      origin: corsResult.origin,
      accessControlAllowOrigin: corsResult.accessControlAllowOrigin,
      accessControlAllowCredentials: corsResult.accessControlAllowCredentials,
      allowed: corsResult.allowed,
      reason: corsResult.reason,
    },
  };

  const response = NextResponse.json(responseData);

  // Set session cookie for demo
  if (!cookieStore.get("session")) {
    response.cookies.set("session", "active", {
      httpOnly: true,
      secure: false, // In production this should be true
      sameSite: "none", // Intentionally lax for the CORS demo
      path: "/",
      maxAge: 3600,
    });
  }

  if (corsResult.allowed && corsResult.accessControlAllowOrigin) {
    applyCorsHeaders(response, corsResult);
  }

  // Always expose CORS headers for educational visualization
  response.headers.set("X-CORS-Mode", getCorsMode());
  response.headers.set("X-CORS-Origin", corsResult.origin || "none");
  response.headers.set(
    "X-CORS-ACAO",
    corsResult.accessControlAllowOrigin || "not-set"
  );
  response.headers.set(
    "X-CORS-ACAC",
    corsResult.accessControlAllowCredentials || "not-set"
  );

  return response;
}

/**
 * OPTIONS /api/account — Preflight handler
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsResult = evaluateCors(origin);

  const response = new NextResponse(null, { status: 204 });

  if (corsResult.allowed) {
    applyCorsHeaders(response, corsResult);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Simulated-Origin"
    );
  }

  return response;
}
