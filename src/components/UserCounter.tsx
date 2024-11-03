"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserCounter() {
  const { data, error } = useSWR("/api/counter", fetcher, {
    refreshInterval: 5000,
  });

  if (!data) {
    return (
      <div className="absolute -right-24 -top-8 animate-pulse">
        <Skeleton className="h-10 w-24 rounded-full bg-indigo-500/20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute -right-10 -top-6 rounded-full bg-red-500/10 p-2 text-red-500">
        <AlertCircle className="h-6 w-6" />
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="absolute -right-32 -top-8 animate-bounce"
    >
      <span className="mr-1 text-lg font-bold text-indigo-500">
        {data.counter.toLocaleString()}
      </span>
      <span className="text-xs">users signed up</span>
    </Badge>
  );
}
