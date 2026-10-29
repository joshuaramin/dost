"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const tslib_1 = require("tslib");
require("dotenv/config");
const ioredis_1 = tslib_1.__importDefault(require("ioredis"));
exports.redis = new ioredis_1.default(process.env.REDIS_URL, {
    connectTimeout: 10000,
    maxRetriesPerRequest: 1,
});
exports.redis.on("error", (err) => {
    console.error("Redis error:", err.message);
});
void (async () => {
    try {
        console.log("PING:", await exports.redis.ping());
    }
    catch (error) {
        console.error("Connection test failed:", error);
        process.exitCode = 1;
    }
    finally {
        exports.redis.disconnect();
    }
})();
