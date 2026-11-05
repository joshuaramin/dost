import "dotenv/config";
import { Redis } from "ioredis";
import type { ConnectionOptions } from "bullmq";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not configured.");
}

export const connection = new Redis(
  "redis://default:HZ3HA2bzW9ZRMtnQ9fRxHfzwyAlh86Nt@commendable-sister-emeraldish-27300.db.redis.io:17406",
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    connectTimeout: 10000,

    retryStrategy(times: any) {
      return Math.min(times * 1000, 20000);
    },
  },
);

connection.on("ready", () => {
  console.log("[Redis] Connected successfully.");
});

connection.on("error", (error: any) => {
  console.error("[Redis] Error:", error.message);
});

export const bullConnection = connection as unknown as ConnectionOptions;
