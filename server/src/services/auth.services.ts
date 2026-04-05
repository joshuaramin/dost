import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { prisma } from "@/lib/prisma/system/prisma";
import {
  ActivityLog,
  DeviceSession,
  User,
} from "@/lib/prisma/system/generated/prisma/client";
import jwt from "jsonwebtoken";

interface DeviceSessions {
  device_name: string;
  device_type: string;
  ip_address: string;
  os: string;
  browser: string;
  user_agent: string;
  is_deleted: boolean;
  is_revoked: boolean;
}
const UserManage = new PrismaCRUDManager<User, "user_id", typeof prisma.user>(
  prisma.user,
  "user_id",
);

const DeviceSessionManage = new PrismaCRUDManager<
  DeviceSession,
  "device_sessions_id",
  typeof prisma.deviceSession
>(prisma.deviceSession, "device_sessions_id");

const ActivityLogManage = new PrismaCRUDManager<
  ActivityLog,
  "activity_logs_id",
  typeof prisma.activityLog
>(prisma.activityLog, "activity_logs_id");

export const AuthLogin = async (data: any, deviceSesssion: DeviceSessions) => {
  const user = await UserManage.unique("email", data.email);

  console.log("Data ", user);

  if (!user) {
    return {
      message: "Email Address is not found",
    };
  }

  await ActivityLogManage.create({
    type: "Logged In",
    decription: "Logged in Macintosdh",
    user: {
      connect: { user_id: user.user_id },
    },
  });

  await DeviceSessionManage.create({
    device_name: deviceSesssion.device_name,
    expired_at: new Date(Date.now()),
    browser: deviceSesssion.browser,
    os: deviceSesssion.os,
    device_type: deviceSesssion.device_type,
    user_agent: deviceSesssion.user_agent,
    ip_address: deviceSesssion.ip_address,
    is_deleted: false,
    is_revoked: false,
    user: { connect: { user_id: user.user_id } },
  });

  const token = jwt.sign({ email: user.email, user_id: user.user_id }, "test", {
    algorithm: "HS512",
    expiresIn: "1d",
  });

  return {
    token,
    user,
  };
};

export async function AuthLogout(id: string) {
  const user = await UserManage.readById(id, "user_id");

  await ActivityLogManage.create({
    type: "Logged Out",
    user: { connect: { user_id: user?.user_id } },
  });

  return user;
}
