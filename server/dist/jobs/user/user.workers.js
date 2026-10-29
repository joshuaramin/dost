"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../lib/redis/index.js");
const welcomeRendered_1 = require("../../lib/emails/rendered/welcomeRendered.js");
const SENDLIB_URL = "https://sendliberty.com/api/send";
const SENDLIB_KEY = process.env.SENDLIB_KEY;
const SENDLIB_FROM_EMAIL = process.env.SENDLIB_FROM_EMAIL;
if (!SENDLIB_KEY) {
    throw new Error("SENDLIB_KEY is not configured");
}
if (!SENDLIB_FROM_EMAIL) {
    throw new Error("SENDLIB_FROM_EMAIL is not configured");
}
exports.welcomeQueue = new bullmq_1.Worker("welcome", async (job) => {
    const { email, fullname } = job.data;
    const html = await (0, welcomeRendered_1.renderWelcome)(fullname, "");
    const response = await fetch(SENDLIB_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SENDLIB_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: `Advocaid PH <niceradvocaid@gmail.com>`,
            to: email,
            subject: "Welcome to AdvoCAID – Your Account is Ready",
            html,
        }),
        signal: AbortSignal.timeout(15_000),
    });
    const responseText = await response.text();
    let result;
    try {
        result = responseText ? JSON.parse(responseText) : null;
    }
    catch {
        result = responseText;
    }
    if (!response.ok) {
        console.error("Sendliberty API request failed:", {
            status: response.status,
            response: result,
        });
        throw new Error(`Sendliberty API returned HTTP ${response.status}`);
    }
    console.log(`Email request accepted for ${email}.`);
    return result;
}, { connection: redis_1.connection });
console.log("🚀 WELCOME EMAIL EXECUTED");
