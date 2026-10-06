import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { AWS_CONFIG } from "../config/aws.config";

const client = new S3Client([AWS_CONFIG]);

export const uploadFileToS3 = async (
  file: Buffer | ReadableStream,
  filename: string,
) => {
  try {
    const upload = new Upload({
      client,
      params: {
        Bucket: process.env.BUCKET!,
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
  } catch (error) {
    console.error("S3 upload failed:", error);
    throw error;
  }
};
