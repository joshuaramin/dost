import { Worker } from "bullmq";
import { connection } from "@/lib/redis";
import { renderWelcome } from "@/lib/emails/rendered/welcomeRendered";

const SENDLIB_URL = "https://sendliberty.com/api/send";
const SENDLIB_KEY = process.env.SENDLIB_KEY;
const SENDLIB_FROM_EMAIL = process.env.SENDLIB_FROM_EMAIL;

if (!SENDLIB_KEY) {
  throw new Error("SENDLIB_KEY is not configured");
}

if (!SENDLIB_FROM_EMAIL) {
  throw new Error("SENDLIB_FROM_EMAIL is not configured");
}

export const welcomeQueue = new Worker(
  "welcome",
  async (job) => {
    const { email, fullname } = job.data;

    const html = await renderWelcome(fullname, "");

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

    let result: unknown;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
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
  },
  { connection },
);

console.log("🚀 WELCOME EMAIL EXECUTED");
