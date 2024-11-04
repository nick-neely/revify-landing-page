import { redis } from "@/lib/redis";
import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

function formatTimeCST(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "short",
    timeStyle: "medium",
  });
}

const logWithTime = (message: string) => {
  console.log(`[${formatTimeCST(Date.now())}] ${message}`);
};

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get("upstash-signature") || "";
  const body = await request.text();

  // Verify the request is from QStash
  const isValid = await receiver.verify({
    signature,
    body,
    url: request.url,
  });

  if (!isValid) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Constants adjusted for 10-minute intervals
  const MAX_USERS_PER_DAY = 100;
  // During non-peak: ~6-18 users per hour (1-3 per 10 mins)
  const MIN_INCREMENT = 1;
  const MAX_INCREMENT = 3;
  // During peak: ~12-24 users per hour (2-4 per 10 mins)
  const PEAK_MIN_INCREMENT = 2;
  const PEAK_MAX_INCREMENT = 4;
  const TOTAL_TARGET_COUNT = 1500;

  // Time windows in UTC
  const INCREMENT_START_HOUR = 15; // 9 AM CST (15:00 UTC)
  const INCREMENT_END_HOUR = 2; // 8 PM CST (2:00 UTC next day)
  const PEAK_START_HOUR = 18; // 12 PM CST (18:00 UTC)
  const PEAK_END_HOUR = 20; // 2 PM CST (20:00 UTC)

  // Check enabled status
  const isEnabled = await redis.get("counter_enabled");
  if (isEnabled !== "true") {
    return NextResponse.json({ status: "disabled" });
  }

  const currentTime = Date.now();
  const counterData = (await redis.hgetall("counter_data")) ?? {};

  let counterValue = parseInt(String(counterData.counter ?? "0"), 10);
  let dailyTotal = parseInt(String(counterData.daily_total ?? "0"), 10);
  let dailyReset = parseInt(String(counterData.daily_reset ?? "0"), 10);

  // Reset daily total if needed
  if (!dailyReset || currentTime >= dailyReset) {
    dailyTotal = 0;
    const tomorrow = new Date();
    tomorrow.setUTCHours(6, 0, 0, 0); // 6 AM UTC = Midnight CST
    if (tomorrow.getTime() <= currentTime) {
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    }
    dailyReset = tomorrow.getTime();
    logWithTime(
      `Daily reset triggered. Next reset: ${formatTimeCST(dailyReset)}`
    );
  }

  const currentHourUTC = new Date(currentTime).getUTCHours();
  const isSameDay = INCREMENT_START_HOUR < INCREMENT_END_HOUR;
  const canIncrementNow = isSameDay
    ? currentHourUTC >= INCREMENT_START_HOUR &&
      currentHourUTC < INCREMENT_END_HOUR
    : currentHourUTC >= INCREMENT_START_HOUR ||
      currentHourUTC < INCREMENT_END_HOUR;

  if (
    canIncrementNow &&
    dailyTotal < MAX_USERS_PER_DAY &&
    counterValue < TOTAL_TARGET_COUNT
  ) {
    let minIncrement = MIN_INCREMENT;
    let maxIncrement = MAX_INCREMENT;

    if (currentHourUTC >= PEAK_START_HOUR && currentHourUTC < PEAK_END_HOUR) {
      minIncrement = PEAK_MIN_INCREMENT;
      maxIncrement = PEAK_MAX_INCREMENT;
    }

    const incrementAmount =
      Math.floor(Math.random() * (maxIncrement - minIncrement + 1)) +
      minIncrement;
    const remainingDaily = MAX_USERS_PER_DAY - dailyTotal;
    const remainingTotal = TOTAL_TARGET_COUNT - counterValue;
    const maxPossibleIncrement = Math.min(
      incrementAmount,
      remainingDaily,
      remainingTotal
    );

    counterValue += maxPossibleIncrement;
    dailyTotal += maxPossibleIncrement;

    await redis.hset("counter_data", {
      counter: counterValue.toString(),
      daily_total: dailyTotal.toString(),
      daily_reset: dailyReset.toString(),
    });

    logWithTime(
      `Counter updated to ${counterValue} (+${maxPossibleIncrement})`
    );
  }

  return NextResponse.json({ counter: counterValue });
}
