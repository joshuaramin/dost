import { Worker } from "bullmq";
import { connection } from "@/lib/redis";
import { renderWelcome } from "@/lib/emails/rendered/welcomeRendered";
import useSES from "@/lib/helpers/useSES";

export const welcomeQueue = new Worker(
  "welcome",
  async (job) => {
    const { email, fullname } = job.data;

    const html = await renderWelcome(fullname);

    await useSES({
      toAddress: [email],
      subject: "Welcome to AdvoCAID – Your Account is Ready",
      html,
    });

    console.log("✅ AFTER SEND EMAIL");
  },
  { connection },
);

console.log("🚀 WELCOME EMAIL EXECUTED");
