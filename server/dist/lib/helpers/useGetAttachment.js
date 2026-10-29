"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttachmentType = void 0;
const client_1 = require("../prisma/system/generated/prisma/client.js");
const getAttachmentType = (mimeType) => {
    if (mimeType.startsWith("image/")) {
        return client_1.AttachmentType.IMAGE;
    }
    if (mimeType.startsWith("video/")) {
        return client_1.AttachmentType.VIDEO;
    }
    if (mimeType.startsWith("audio/")) {
        return client_1.AttachmentType.AUDIO;
    }
    if (mimeType === "application/pdf") {
        return client_1.AttachmentType.PDF;
    }
    if (mimeType.includes("word") ||
        mimeType.includes("excel") ||
        mimeType.includes("powerpoint") ||
        mimeType.includes("text") ||
        mimeType.includes("officedocument")) {
        return client_1.AttachmentType.DOCUMENT;
    }
    return client_1.AttachmentType.OTHER;
};
exports.getAttachmentType = getAttachmentType;
