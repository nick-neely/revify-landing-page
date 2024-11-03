"use client";

import { updateCounter } from "@/app/actions";
import { useEffect } from "react";

export default function CounterUpdater() {
  useEffect(() => {
    const updateRandomly = () => {
      const amount = Math.floor(Math.random() * 10) + 1;
      const delay = Math.floor(Math.random() * 5000) + 1000;
      setTimeout(() => {
        updateCounter(amount);
        updateRandomly();
      }, delay);
    };

    updateRandomly();
  }, []);

  return null;
}
