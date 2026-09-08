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
      decription: true,
      user: {
        select: { user_id: true },
      },
    },
  });
};

export const CreateActivityLogs = async (data: any) => {
  return ActivityLogManage.create({
    type: data.type,
    decription: data.description,
    user: { connect: { user_id: data.user_id } },
  });
};
