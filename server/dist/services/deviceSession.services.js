import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
const DeviceSessionManage = new PrismaCRUDManager(prisma.deviceSession, "device_sessions_id");
export const GetAllDeviceSession = async (id, { after, filter: { orderBy, search, sortBy }, limit, before, }) => {
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
