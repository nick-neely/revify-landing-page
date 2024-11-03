// app/api/counter/route.ts
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Control constants
  const MAX_USERS_PER_DAY = 100; // Max users per day
  const MIN_INCREMENT = 1; // Min increment amount
  const MAX_INCREMENT = 5; // Max increment amount
  const MIN_INTERVAL_MS = 30 * 1000; // Min interval: 30 seconds
  const MAX_INTERVAL_MS = 15 * 60 * 1000; // Max interval: 15 minutes
  const PEAK_START_HOUR = 12; // 12 PM UTC
  const PEAK_END_HOUR = 14; // 2 PM UTC
  const PEAK_MIN_INCREMENT = 3;
  const PEAK_MAX_INCREMENT = 7;
  const TOTAL_TARGET_COUNT = 1500; // Max counter value
  const INCREMENT_START_HOUR = 6; // Start increment at 6 AM UTC
  const INCREMENT_END_HOUR = 22; // End increment at 10 PM UTC

  const currentTime = Date.now();

  const [counterValueStr, nextIncrementStr, dailyTotalStr, dailyResetStr] =
    await redis.mget<string[]>(
      "users_signed_up",
      "users_signed_up_next_increment",
      "users_signed_up_daily_total",
      "users_signed_up_daily_reset"
    );

  let counterValue = parseInt(counterValueStr || "0", 10);
  let nextIncrement = parseInt(nextIncrementStr || "0", 10);
  let dailyTotal = parseInt(dailyTotalStr || "0", 10);
  let dailyReset = parseInt(dailyResetStr || "0", 10);

  // Reset daily total if needed
  if (!dailyReset || currentTime >= dailyReset) {
    dailyTotal = 0;
    // Set next reset to midnight UTC
    const tomorrow = new Date();
    tomorrow.setUTCHours(0, 0, 0, 0);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    dailyReset = tomorrow.getTime();
    await redis.set("users_signed_up_daily_reset", dailyReset.toString());
    await redis.set("users_signed_up_daily_total", dailyTotal.toString());
  }

  // Initialize next increment if not set
  if (!nextIncrement) {
    nextIncrement =
      currentTime + getRandomInterval(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    await redis.set("users_signed_up_next_increment", nextIncrement.toString());
  }

  // Get current hour in UTC
  const currentHourUTC = new Date(currentTime).getUTCHours();

  const canIncrementNow =
    currentHourUTC >= INCREMENT_START_HOUR &&
    currentHourUTC < INCREMENT_END_HOUR;

  // Check if it's time to increment the counter
  if (currentTime >= nextIncrement) {
    // Schedule the next increment regardless
    nextIncrement =
      currentTime + getRandomInterval(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    await redis.set("users_signed_up_next_increment", nextIncrement.toString());

    // Proceed with incrementing if conditions are met
    if (
      canIncrementNow &&
      dailyTotal < MAX_USERS_PER_DAY &&
      counterValue < TOTAL_TARGET_COUNT
    ) {
      let minIncrement = MIN_INCREMENT;
      let maxIncrement = MAX_INCREMENT;

      // Check if it's peak hours
      if (currentHourUTC >= PEAK_START_HOUR && currentHourUTC < PEAK_END_HOUR) {
        minIncrement = PEAK_MIN_INCREMENT;
        maxIncrement = PEAK_MAX_INCREMENT;
      }

      // Generate a random increment amount within the adjusted range
      const incrementAmount = getRandomIncrement(minIncrement, maxIncrement);

      // Ensure we don't exceed daily or total maximums
      const remainingDaily = MAX_USERS_PER_DAY - dailyTotal;
      const remainingTotal = TOTAL_TARGET_COUNT - counterValue;
      const maxPossibleIncrement = Math.min(
        incrementAmount,
        remainingDaily,
        remainingTotal
      );

      // Increment the counter
      counterValue += maxPossibleIncrement;
      dailyTotal += maxPossibleIncrement;
      await redis.set("users_signed_up", counterValue.toString());
      await redis.set("users_signed_up_daily_total", dailyTotal.toString());
    }
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
