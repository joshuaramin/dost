import "dotenv/config";

import { Queue } from "bullmq";
import Redis from "ioredis";
import type { ConnectionOptions } from "bullmq";

export const connection = new Redis({
  // host: process.env.REDIS_HOST || "127.0.0.1",
  // port: Number(process.env.REDIS_PORT || 6379),
  // maxRetriesPerRequest: null,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 3000,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
}) as unknown as ConnectionOptions;
