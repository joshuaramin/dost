import "dotenv/config";
import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { prisma } from "@/lib/prisma/system/prisma";
import {
  ActivityLog,
  DeviceSession,
  Profile,
  User,
} from "@/lib/prisma/system/generated/prisma/client";
import jwt from "jsonwebtoken";
import useSES from "@/lib/helpers/useSES";
import { renderOTPTemplate } from "@/lib/emails/rendered/otpRendered";

console.log({
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});

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

const ProfileManage = new PrismaCRUDManager<
  Profile,
  "profile_id",
  typeof prisma.profile
>(prisma.profile, "profile_id");
export const AuthLogin = async (data: any, deviceSesssion: DeviceSessions) => {
  const user = await UserManage.unique("email", data.email, {
    select: {
      email: true,
      user_id: true,
      Profile: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!user) {
    return {
      message: "Email Address is not found",
    };
  }

  const profile = await ProfileManage.readById(user.user_id, "user_id");

  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const fullname = `${firstName} ${lastName}`.trim();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const html = await renderOTPTemplate(fullname, otp);

  await useSES({
    html,
    subject: "Your OTP Code",
    toAddress: [user.email],
  });

  await ActivityLogManage.create({
    type: "Logged In",
    decription: `Logged in from ${deviceSesssion.device_name}`,
    user: {
      connect: { user_id: user.user_id },
    },
  });

  await DeviceSessionManage.create({
    device_name: deviceSesssion.device_name,
    expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24), // +1 day
    browser: deviceSesssion.browser,
    os: deviceSesssion.os,
    device_type: deviceSesssion.device_type,
    user_agent: deviceSesssion.user_agent,
    ip_address: deviceSesssion.ip_address,
    is_deleted: false,
    is_revoked: false,
    user: { connect: { user_id: user.user_id } },
  });

  const token = jwt.sign(
    { email: user.email, user_id: user.user_id },
    (process.env.JWT_SECRET as string) || "testing",
    {
      algorithm: "HS512",
      expiresIn: "1d",
    },
  );

  return {
    token,
    user,
    otp, // optionally return or store securely
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
