import { Queue } from "bullmq";
import { connection } from "@/lib/redis/index";

export const authQueue = new Queue("file-upload", {
  connection,
});
