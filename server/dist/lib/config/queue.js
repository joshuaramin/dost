import { authQueue, authVerified } from "../../jobs/auth/auth.queue.js";
import { userQueue } from "../../jobs/user/user.queue.js";
export const queues = [authQueue, authVerified, userQueue];
