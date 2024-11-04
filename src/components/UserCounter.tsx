"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserCounter() {
  const { data, error } = useSWR("/api/counter", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,  // Don't revalidate on focus
    keepPreviousData: true,    // Keep showing previous data while revalidating
    dedupingInterval: 5000,    // Dedupe requests within 5s window
  });

  if (!data) {
    return (
      <div className="absolute -right-24 -top-8 animate-pulse">
        <Skeleton className="h-10 w-24 rounded-full bg-indigo-200 dark:bg-indigo-500/20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute -right-10 -top-6 rounded-full bg-red-100 dark:bg-red-500/10 p-2 text-red-500">
        <AlertCircle className="h-6 w-6" />
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="absolute -right-32 -top-8 animate-bounce bg-white/80 dark:bg-slate-900/80 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
    >
      <span className="mr-1 text-lg font-bold text-indigo-600 dark:text-indigo-500">
        {data.counter.toLocaleString()}
      </span>
      <span className="text-xs text-slate-600 dark:text-slate-400">users signed up</span>
    </Badge>
  );
}
