const UPSTASH_REST_URL = process.env.UPSTASH_REST_URL!;
const UPSTASH_REST_TOKEN = process.env.UPSTASH_REST_TOKEN!;

export async function getCounter(): Promise<number> {
  const response = await fetch(`${UPSTASH_REST_URL}/get/userCounter`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
    },
  });
  const data = await response.json();
  return parseInt(data.result) || 0;
}

export async function incrementCounter(amount: number): Promise<number> {
  const response = await fetch(
    `${UPSTASH_REST_URL}/incrby/userCounter/${amount}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data.result;
}
