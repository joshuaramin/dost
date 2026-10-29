"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = tslib_1.__importDefault(require("multer"));
const multer_s3_1 = tslib_1.__importDefault(require("multer-s3"));
const aws_config_1 = require("../config/aws.config");
const s3 = new client_s3_1.S3Client({
    ...aws_config_1.AWS_CONFIG,
    credentials: {
        accessKeyId: aws_config_1.AWS_CONFIG.credentials.accessKeyId,
        secretAccessKey: aws_config_1.AWS_CONFIG.credentials.secretAccessKey,
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.AWS_BUCKET,
        contentDisposition: "inline",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
});
exports.default = upload;
