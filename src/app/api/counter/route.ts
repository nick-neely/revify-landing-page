import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get counter value with minimal Redis commands
  const counterData = await redis.hgetall("counter_data") ?? {};
  const counterValue = parseInt(String(counterData.counter ?? "0"), 10);
  
  return NextResponse.json({ counter: counterValue });
}
