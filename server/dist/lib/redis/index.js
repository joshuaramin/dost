import "dotenv/config";
import { Redis } from "ioredis";
const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT);
const username = process.env.REDIS_USERNAME;
const password = process.env.REDIS_PASSWORD;
if (!host || !port || !password) {
    throw new Error("Missing Redis configuration. Check REDIS_HOST, REDIS_PORT, and REDIS_PASSWORD.");
}
export const connection = new Redis("redis://default:HZ3HA2bzW9ZRMtnQ9fRxHfzwyAlh86Nt@commendable-sister-emeraldish-27300.db.redis.io:17406", {
    connectTimeout: 15000,
    maxRetriesPerRequest: 100000,
    retryStrategy(times) {
        return times > 3 ? null : times * 1000;
    },
});
connection.on("connect", () => {
    console.log("[Redis] Connecting to Redis Cloud...");
});
connection.on("ready", () => {
    console.log("[Redis] Connected and ready.");
});
connection.on("error", (error) => {
    console.error("[Redis] Connection error:", error.message);
});
connection.on("close", () => {
    console.warn("[Redis] Connection closed.");
});
//# sourceMappingURL=index.js.map