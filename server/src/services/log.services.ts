import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { ActivityLog } from "../lib/prisma/system/generated/prisma/client.js";

import { prisma } from "../lib/prisma/system/prisma.js";
import { ActivityLogsInterface } from "../lib/interface/activityLogs.interface.js";
import { ActivityLogWhereInput } from "../lib/prisma/system/generated/prisma/models.js";

const ActivityLogManage = new PrismaCRUDManager<
  ActivityLog,
  "activity_logs_id",
  typeof prisma.activityLog
>(prisma.activityLog, "activity_logs_id");

export const GetAllActivityLogs = async (
  id: string,
  { after, before, filter: { orderBy, sortBy }, limit }: ActivityLogsInterface,
) => {
  let where: ActivityLogWhereInput = {
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

export const CreateActivityLogs = async (data: any) => {
  return ActivityLogManage.create({
    type: data.type,
    description: data.description,
    user: { connect: { user_id: data.user_id } },
  });
};
