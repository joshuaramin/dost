import { Queue } from "bullmq";
import { connection } from "@/lib/redis/index";

export const userQueue = new Queue("auth", {
  connection,
});
