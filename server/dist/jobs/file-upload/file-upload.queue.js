import { Queue } from "bullmq";
import { connection } from "../../lib/redis/index.js";
export const authQueue = new Queue("file-upload", {
    connection,
});
