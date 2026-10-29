"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueue = void 0;
const bullmq_1 = require("bullmq");
const index_1 = require("../../lib/redis/index.js");
exports.userQueue = new bullmq_1.Queue("auth", {
    connection: index_1.connection,
});
