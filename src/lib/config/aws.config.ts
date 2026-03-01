export const AWS_CONFIG = {
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_KEY,
    secretAccessKey: process.env.AWS_SES_SKEY,
  },
};
