import { NextRequest, NextResponse } from "next/server";
import {
  getCorsMode,
  setCorsMode,
  getAllowedOrigins,
} from "@/lib/cors";

/**
 * GET /api/mode
 *
 * Returns the current CORS mode and the list of allowed origins.
 */
export async function GET() {
  return NextResponse.json({
    mode: getCorsMode(),
    allowedOrigins: getAllowedOrigins(),
  });
}

/**
 * POST /api/mode
 *
 * Switches between vulnerable and safe CORS modes.
 * Body: { "mode": "vulnerable" | "safe" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.mode !== "vulnerable" && body.mode !== "safe") {
      return NextResponse.json(
        { error: 'Параметр "mode" должен быть "vulnerable" или "safe"' },
        { status: 400 }
      );
    }

    setCorsMode(body.mode);

    return NextResponse.json({
      mode: getCorsMode(),
      allowedOrigins: getAllowedOrigins(),
      message:
        body.mode === "vulnerable"
          ? "Уязвимый режим активирован. Любой Origin будет скопирован в Access-Control-Allow-Origin."
          : "Безопасный режим активирован. Доступ разрешён только для доменов из белого списка.",
    });
  } catch {
    return NextResponse.json(
      { error: "Неверный формат запроса" },
      { status: 400 }
    );
  }
}
