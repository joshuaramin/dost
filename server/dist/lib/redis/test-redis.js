import { Redis } from "ioredis";
const redis = new Redis("redis://default:HZ3HA2bzW9ZRMtnQ9fRxHfzwyAlh86Nt@commendable-sister-emeraldish-27300.db.redis.io:17406", {
    connectTimeout: 15000,
    maxRetriesPerRequest: 100000,
    retryStrategy(times) {
        return times > 3 ? null : times * 1000;
    },
});
redis.on("connect", () => {
    console.log("[Redis] TCP connection established");
});
redis.on("ready", () => {
    console.log("[Redis] Connected and ready!");
});
redis.on("error", (error) => {
    console.error("[Redis Error]", error.message);
});
async function main() {
    try {
        const pong = await redis.ping();
        console.log("[Redis] PING:", pong);
        await redis.set("dost:test", "connected");
        const value = await redis.get("dost:test");
        console.log("[Redis] GET:", value);
    }
    catch (error) {
        console.error("[Redis Test Failed]", error);
        process.exitCode = 1;
    }
    finally {
        await redis.quit();
    }
}
main();
