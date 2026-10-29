"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_ses_1 = require("@aws-sdk/client-ses");
const aws_config_1 = require("../config/aws.config");
const emailSES = new client_ses_1.SESClient({
    ...aws_config_1.AWS_CONFIG,
    credentials: {
        accessKeyId: aws_config_1.AWS_CONFIG.credentials.accessKeyId,
        secretAccessKey: aws_config_1.AWS_CONFIG.credentials.secretAccessKey,
    },
});
const sendEmailSES = async ({ html, subject, bccAddress, ccAddress, toAddress, }) => {
    if (!toAddress || toAddress.length === 0) {
        throw new Error("At least one recipient is required in toAddress");
    }
    const command = new client_ses_1.SendEmailCommand({
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
    }
    catch (error) {
        throw error;
    }
};
exports.default = sendEmailSES;
