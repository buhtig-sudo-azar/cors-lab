import { NextRequest, NextResponse } from "next/server";
import {
  evaluateCors,
  applyCorsHeaders,
  getCorsMode,
} from "@/lib/cors";

/**
 * GET /api/profile
 *
 * Returns user profile data.
 * In vulnerable mode, any origin is allowed to read this data cross-origin.
 * In safe mode, only whitelisted origins are allowed.
 */
export async function GET(request: NextRequest) {
  // Support simulated cross-origin requests for the attacker page demo.
  const simulatedOrigin = request.headers.get("x-simulated-origin");
  const origin = simulatedOrigin || request.headers.get("origin");
  const corsResult = evaluateCors(origin);

  // Handle preflight (OPTIONS is handled automatically by Next.js,
  // but we still need to set CORS headers for the actual response)

  const profileData = {
    username: "student",
    email: "student@example.local",
    role: "user",
  };

  const responseData = {
    data: corsResult.allowed ? profileData : null,
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
 * OPTIONS /api/profile — Preflight handler
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsResult = evaluateCors(origin);

  const response = new NextResponse(null, { status: 204 });

  if (corsResult.allowed) {
    applyCorsHeaders(response, corsResult);
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Simulated-Origin"
    );
  }

  return response;
}
