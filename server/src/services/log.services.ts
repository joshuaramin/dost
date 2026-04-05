import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { ActivityLog } from "@/lib/prisma/system/generated/prisma/client";

import { prisma } from "@/lib/prisma/system/prisma";
import { ActivityLogsInterface } from "@/lib/interface/activityLogs.interface";
import { ActivityLogWhereInput } from "@/lib/prisma/system/generated/prisma/models";

const ActivityLogManage = new PrismaCRUDManager<
  ActivityLog,
  "activity_logs_id",
  typeof prisma.activityLog
>(prisma.activityLog, "activity_logs_id");

export const GetAllActivityLogs = async (
  id: string,
  { after, filter: { orderBy, sortBy }, limit }: ActivityLogsInterface,
) => {
  let where: ActivityLogWhereInput = {
    is_deleted: false,
    user: { user_id: id },
  };
  return ActivityLogManage.read({
    where,
    limit,
    cursor: after,
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};
