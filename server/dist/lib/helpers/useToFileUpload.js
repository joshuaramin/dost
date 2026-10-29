"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const aws_config_1 = require("../config/aws.config");
const client = new client_s3_1.S3Client([aws_config_1.AWS_CONFIG]);
const uploadFileToS3 = async (file, filename) => {
    try {
        const upload = new lib_storage_1.Upload({
            client,
            params: {
                Bucket: process.env.BUCKET,
                Key: filename,
                Body: file,
            },
            partSize: 1024 * 1024 * 5,
        });
        upload.on("httpUploadProgress", (progress) => {
            console.log("Upload progress:", progress);
        });
        await upload.done();
        return `https://ajxuatqnkjknuqeszdzz.supabase.co/storage/v1/object/public/${process.env.BUCKET}/${filename}`;
    }
    catch (error) {
        console.error("S3 upload failed:", error);
        throw error;
    }
};
exports.uploadFileToS3 = uploadFileToS3;
