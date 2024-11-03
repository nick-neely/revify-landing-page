import { redis } from "@/lib/redis";
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

export async function GET(request: NextRequest) {
  const MAX_USERS_PER_DAY = 100;
  const MIN_INCREMENT = 1;
  const MAX_INCREMENT = 3;
  const MIN_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
  const MAX_INTERVAL_MS = 16 * 60 * 1000; // 16 minutes
  const PEAK_START_HOUR = 18; // 12 PM CST (18:00 UTC)
  const PEAK_END_HOUR = 20; // 2 PM CST (20:00 UTC)
  const PEAK_MIN_INCREMENT = 2;
  const PEAK_MAX_INCREMENT = 4;
  const TOTAL_TARGET_COUNT = 1500;
  const INCREMENT_START_HOUR = 15; // Start increment at 9 AM CST (15:00 UTC)
  const INCREMENT_END_HOUR = 2; // End increment at 8 PM CST (2 AM UTC)

  const isEnabled = await redis.get("counter_enabled");

  const currentTime = Date.now();

  logWithTime(`Counter request received`);

  // Get all values in a single operation using hash
  const counterData = (await redis.hgetall("counter_data")) ?? {};
  logWithTime(
    `Current state - Counter: ${counterData.counter ?? 0}, Daily Total: ${counterData.daily_total ?? 0}, Enabled: ${isEnabled}`
  );

  let counterValue = parseInt(String(counterData.counter ?? "0"), 10);
  let nextIncrement = parseInt(String(counterData.next_increment ?? "0"), 10);
  let dailyTotal = parseInt(String(counterData.daily_total ?? "0"), 10);
  let dailyReset = parseInt(String(counterData.daily_reset ?? "0"), 10);

  const pipeline = redis.pipeline();
  let updateRequired = false;

  // Reset daily total if needed
  if (!dailyReset || currentTime >= dailyReset) {
    dailyTotal = 0;
    // Set next reset to midnight CST (6:00 UTC)
    const tomorrow = new Date();
    tomorrow.setUTCHours(6, 0, 0, 0); // 6 AM UTC = Midnight CST
    if (tomorrow.getTime() <= currentTime) {
      // If we've already passed 6 AM UTC today, set for next day
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    }
    dailyReset = tomorrow.getTime();
    logWithTime(
      `Daily reset triggered. Next reset: ${formatTimeCST(dailyReset)}`
    );
    updateRequired = true;
  }

  // Initialize next increment if not set
  if (!nextIncrement) {
    nextIncrement =
      currentTime + getRandomInterval(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    updateRequired = true;
  }

  // Get current hour in UTC
  const currentHourUTC = new Date(currentTime).getUTCHours();

  const isSameDay = INCREMENT_START_HOUR < INCREMENT_END_HOUR;
  const canIncrementNow = isSameDay
    ? currentHourUTC >= INCREMENT_START_HOUR &&
      currentHourUTC < INCREMENT_END_HOUR
    : currentHourUTC >= INCREMENT_START_HOUR ||
      currentHourUTC < INCREMENT_END_HOUR;

  // Check if it's time to increment the counter
  if (isEnabled === "true" && currentTime >= nextIncrement) {
    logWithTime(
      `Increment window ${currentHourUTC}h UTC - Can increment: ${canIncrementNow}, Peak hour: ${currentHourUTC >= PEAK_START_HOUR && currentHourUTC < PEAK_END_HOUR}`
    );

    nextIncrement =
      currentTime + getRandomInterval(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    updateRequired = true;

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

      const incrementAmount = getRandomIncrement(minIncrement, maxIncrement);
      const remainingDaily = MAX_USERS_PER_DAY - dailyTotal;
      const remainingTotal = TOTAL_TARGET_COUNT - counterValue;
      const maxPossibleIncrement = Math.min(
        incrementAmount,
        remainingDaily,
        remainingTotal
      );

      counterValue += maxPossibleIncrement;
      dailyTotal += maxPossibleIncrement;
      logWithTime(
        `Counter updated - Previous: ${counterValue - maxPossibleIncrement}, New: ${counterValue}, Increment: ${maxPossibleIncrement}, Daily Total: ${dailyTotal}`
      );
      updateRequired = true;
    }
  }

  // Use single HSET to update all values if any changes occurred
  if (updateRequired) {
    logWithTime(
      `Redis update required, next increment: ${formatTimeCST(nextIncrement)}`
    );
    pipeline.hset("counter_data", {
      counter: counterValue.toString(),
      next_increment: nextIncrement.toString(),
      daily_total: dailyTotal.toString(),
      daily_reset: dailyReset.toString(),
    });

    // Execute pipeline
    await pipeline.exec();
  }

  return NextResponse.json({ counter: counterValue });
}

function getRandomInterval(minInterval: number, maxInterval: number) {
  return (
    Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  );
}

function getRandomIncrement(minIncrement: number, maxIncrement: number) {
  return (
    Math.floor(Math.random() * (maxIncrement - minIncrement + 1)) + minIncrement
  );
}
