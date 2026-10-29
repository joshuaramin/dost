"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllDeviceSession = void 0;
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
const DeviceSessionManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.deviceSession, "device_sessions_id");
const GetAllDeviceSession = async (id, { after, filter: { orderBy, search, sortBy }, limit, before, }) => {
    let where = {
        is_deleted: false,
        user: { user_id: id },
    };
    return DeviceSessionManage.read({
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
    });
};
exports.GetAllDeviceSession = GetAllDeviceSession;
