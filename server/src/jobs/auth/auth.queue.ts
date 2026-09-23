import { Queue } from "bullmq";
import { connection } from "@/lib/redis/index";

export const authQueue = new Queue("auth", {
  connection,
});

export const authVerified = new Queue("registration-email", { connection });
