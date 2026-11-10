import { Queue } from "bullmq";
import { connection } from "../../lib/redis/index.js";
export const userQueue = new Queue("auth", {
    connection,
});
//# sourceMappingURL=user.queue.js.map