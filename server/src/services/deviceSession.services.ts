import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { DeviceSession } from "../lib/prisma/system/generated/prisma/client.js";
import { prisma } from "../lib/prisma/system/prisma.js";
import { DeviceSessionWhereInput } from "../lib/prisma/system/generated/prisma/models.js";
import { DeviceSessionInterface } from "../lib/interface/device-sessions.js";

const DeviceSessionManage = new PrismaCRUDManager<
  DeviceSession,
  "device_sessions_id",
  typeof prisma.deviceSession
>(prisma.deviceSession, "device_sessions_id");

export const GetAllDeviceSession = async (
  id: string,
  {
    after,
    filter: { orderBy, search, sortBy },
    limit,
    before,
  }: DeviceSessionInterface,
) => {
  let where: DeviceSessionWhereInput = {
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
