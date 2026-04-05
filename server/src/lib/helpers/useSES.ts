import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { AWS_CONFIG } from "../config/aws.config";

const emailSES = new SESClient(AWS_CONFIG);

interface Props {
  source: string;
  html: string;
  subject: string;
  toAddress?: string[];
  bccAddress?: string[];
  ccAddress?: string[];
}

const useSES = async ({
  source,
  html,
  subject,
  bccAddress,
  ccAddress,
  toAddress,
}: Props) => {
  try {
    const email = new SendEmailCommand({
      Source: source,
      Destination: {
        ToAddresses: toAddress,
        BccAddresses: bccAddress,
        CcAddresses: ccAddress,
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
        },
      },
    });

    const response = await emailSES.send(email);

    console.log("Response: ", response);
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export default useSES;
