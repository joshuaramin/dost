"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivityLogs = exports.GetAllActivityLogs = void 0;
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
const ActivityLogManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.activityLog, "activity_logs_id");
const GetAllActivityLogs = async (id, { after, before, filter: { orderBy, sortBy }, limit }) => {
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
exports.GetAllActivityLogs = GetAllActivityLogs;
const CreateActivityLogs = async (data) => {
    return ActivityLogManage.create({
        type: data.type,
        description: data.description,
        user: { connect: { user_id: data.user_id } },
    });
};
exports.CreateActivityLogs = CreateActivityLogs;
