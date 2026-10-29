"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const tslib_1 = require("tslib");
require("dotenv/config");
const ioredis_1 = tslib_1.__importDefault(require("ioredis"));
exports.connection = new ioredis_1.default({
    // host: process.env.REDIS_HOST || "127.0.0.1",
    // port: Number(process.env.REDIS_PORT || 6379),
    // maxRetriesPerRequest: null,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    connectTimeout: 3000,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});
