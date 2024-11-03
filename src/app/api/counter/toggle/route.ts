import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.COUNTER_ADMIN_TOKEN;

  if (
    !authHeader ||
    !expectedToken ||
    authHeader !== `Bearer ${expectedToken}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request. 'enabled' must be a boolean" },
        { status: 400 }
      );
    }

    await redis.set("counter_enabled", body.enabled.toString());

    return NextResponse.json({ success: true, enabled: body.enabled });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Invalid JSON payload. Expected: { enabled: boolean }" },
      { status: 400 }
    );
  }
}
