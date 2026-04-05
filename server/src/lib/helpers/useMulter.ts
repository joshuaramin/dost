import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import multerS3 from "multer-s3";
import { AWS_CONFIG } from "../config/aws.config";

const s3 = new S3Client(AWS_CONFIG);

const upload = multer({
  storage: multerS3({
    s3,
    acl: "private",
    bucket: process.env.AWS_BUCKET as string,
    contentDisposition: "inline",

    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

export default upload;

export async function getSignedUrlForKey(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET as string,
    Key: key,
  });

  return await getSignedUrl(s3, command, {
    expiresIn: 604800,
  });
}
