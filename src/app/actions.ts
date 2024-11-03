"use server";

import { incrementCounter } from "@/lib/redis";

export async function updateCounter(amount: number) {
  await incrementCounter(amount);
}
