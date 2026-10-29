"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authQueue = void 0;
const bullmq_1 = require("bullmq");
const index_1 = require("../../lib/redis/index.js");
exports.authQueue = new bullmq_1.Queue("file-upload", {
    connection: index_1.connection,
});
