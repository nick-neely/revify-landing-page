import { getCounter } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await getCounter();
  return NextResponse.json({ count });
}
