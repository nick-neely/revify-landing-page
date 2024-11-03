const UPSTASH_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REST_URL || !UPSTASH_REST_TOKEN) {
  console.error("Upstash Redis environment variables are not set");
}

export async function getCounter(): Promise<number> {
  if (!UPSTASH_REST_URL || !UPSTASH_REST_TOKEN) {
    console.error("Upstash Redis environment variables are not set");
    return 0;
  }

  try {
    const response = await fetch(`${UPSTASH_REST_URL}/get/userCounter`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return parseInt(data.result) || 0;
  } catch (error) {
    console.error("Error fetching counter:", error);
    return 0;
  }
}

export async function incrementCounter(amount: number): Promise<number> {
  if (!UPSTASH_REST_URL || !UPSTASH_REST_TOKEN) {
    console.error("Upstash Redis environment variables are not set");
    return 0;
  }

  try {
    const response = await fetch(
      `${UPSTASH_REST_URL}/incrby/userCounter/${amount}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error incrementing counter:", error);
    return 0;
  }
}
