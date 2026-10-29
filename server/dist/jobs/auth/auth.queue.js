"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVerified = exports.authQueue = void 0;
const bullmq_1 = require("bullmq");
const index_1 = require("../../lib/redis/index.js");
exports.authQueue = new bullmq_1.Queue("auth", {
    connection: index_1.connection,
});
exports.authVerified = new bullmq_1.Queue("registration-email", { connection: index_1.connection });
