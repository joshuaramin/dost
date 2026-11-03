import "dotenv/config";
import { Redis } from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!, {
  connectTimeout: 10000,
  maxRetriesPerRequest: 1,
});

redis.on("error", (err: any) => {
  console.error("Redis error:", err.message);
});

void (async () => {
  try {
    console.log("PING:", await redis.ping());
  } catch (error) {
    console.error("Connection test failed:", error);
    process.exitCode = 1;
  } finally {
    redis.disconnect();
  }
})();
