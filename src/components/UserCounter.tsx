"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserCounter() {
  const { data, error } = useSWR("/api/counter", fetcher, {
    refreshInterval: 1000, // Refresh every second
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="text-4xl font-bold">
      {data.count.toLocaleString()} users signed up
    </div>
  );
}
