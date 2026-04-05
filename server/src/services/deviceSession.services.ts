import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { DeviceSession } from "@/lib/prisma/system/generated/prisma/client";
import { prisma } from "@/lib/prisma/system/prisma";
import { DeviceSessionWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { DeviceSessionInterface } from "@/lib/interface/deviceSession.interface";

const DeviceSessionManage = new PrismaCRUDManager<
  DeviceSession,
  "device_sessions_id",
  typeof prisma.deviceSession
>(prisma.deviceSession, "device_sessions_id");

export const GetAllDeviceSession = async (
  id: string,
  { after, filter: { orderBy, search, sortBy }, limit }: DeviceSessionInterface,
) => {
  let where: DeviceSessionWhereInput = {
    is_deleted: false,
    user: { user_id: id },
  };

  return DeviceSessionManage.read({
    where,
    limit,
    cursor: after,
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};
