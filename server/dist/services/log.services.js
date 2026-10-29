import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
const ActivityLogManage = new PrismaCRUDManager(prisma.activityLog, "activity_logs_id");
export const GetAllActivityLogs = async (id, { after, before, filter: { orderBy, sortBy }, limit }) => {
    let where = {
        is_deleted: false,
        user: { user_id: id },
    };
    return ActivityLogManage.read({
        where,
        limit,
        ...(after && {
            cursor: after,
            direction: "forward",
        }),
        ...(before && {
            cursor: before,
            direction: "backward",
        }),
        orderBy: {
            [orderBy]: sortBy,
        },
        select: {
            type: true,
            activity_logs_id: true,
            created_at: true,
            description: true,
            user: {
                select: { user_id: true },
            },
        },
    });
};
export const CreateActivityLogs = async (data) => {
    return ActivityLogManage.create({
        type: data.type,
        description: data.description,
        user: { connect: { user_id: data.user_id } },
    });
};
