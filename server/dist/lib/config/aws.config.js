"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_CONFIG = void 0;
exports.AWS_CONFIG = {
    forcePathStyle: true,
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};
