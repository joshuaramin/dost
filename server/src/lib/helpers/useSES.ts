import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { AWS_CONFIG } from "../config/aws.config";

const emailSES = new SESClient(AWS_CONFIG);

interface Props {
  html: string;
  subject: string;
  toAddress?: string[];
  bccAddress?: string[];
  ccAddress?: string[];
}

const sendEmailSES = async ({
  html,
  subject,
  bccAddress,
  ccAddress,
  toAddress,
}: Props) => {
  if (!toAddress || toAddress.length === 0) {
    throw new Error("At least one recipient is required in toAddress");
  }

  const command = new SendEmailCommand({
    Source: "ADVOCAID <raminjoshua05@gmail.com>",
    Destination: {
      ToAddresses: toAddress ?? [],
      BccAddresses: bccAddress ?? [],
      CcAddresses: ccAddress ?? [],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },
      },
    },
  });

  try {
    const response = await emailSES.send(command);
    return response;
  } catch (error) {
    throw error;
  }
};

export default sendEmailSES;
