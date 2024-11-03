import { getCounter } from "@/lib/redis";

export default async function UserCounter() {
  const count = await getCounter();

  return (
    <div className="text-4xl font-bold">
      {count.toLocaleString()} users signed up
    </div>
  );
}
