import "dotenv/config";
import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { prisma } from "@/lib/prisma/system/prisma";
import {
  ActivityLog,
  DeviceSession,
  OTP,
  User,
} from "@/lib/prisma/system/generated/prisma/client";
import jwt from "jsonwebtoken";
import { generateOTP, hashOTP } from "@/utils/otpGenerator";
import { AppError } from "@/lib/common/appError";
import { authQueue, authVerified } from "@/jobs/auth/auth.queue";
import { DeviceSessionWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { DeviceSessionInterface } from "@/lib/interface/device-sessions";

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

const OTPManage = new PrismaCRUDManager<OTP, "otp_id", typeof prisma.oTP>(
  prisma.oTP,
  "otp_id",
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

export const AuthLogin = async (data: any, deviceSession: DeviceSessions) => {
  const user = await UserManage.unique("email", data.email);

  if (!user) {
    throw new AppError("Email address is not found", 400);
  }

  const profile = await prisma.profile.findFirst({
    where: { User: { email: data.email } },
  });

  const fullname = profile?.first_name + " " + profile?.last_name;

  await authQueue.add(
    "send-login-otp",
    {
      email: data.email,
      fullname,
      ip: deviceSession.ip_address,
      userAgent: deviceSession.user_agent,
    },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
    },
  );

  return { email: data.email, success: true };
};

export const AuthVerfiy = async (
  email: string,
  data: any,
  deviceSession: DeviceSessions,
) => {
  const hashed = hashOTP(data.code);

  const otp = await prisma.oTP.findFirst({
    where: {
      identifier: email,
      type: "login",
      is_used: false,
    },
    orderBy: { created_at: "desc" },
  });

  if (!otp) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  if (otp.expires_at < new Date()) {
    throw new AppError("One-Time Password expired", 400);
  }

  if (otp.attempts >= otp.max_attempts) {
    throw new AppError("Too many attempts", 429);
  }

  if (otp.code_hash !== hashed) {
    await prisma.oTP.update({
      where: { otp_id: otp.otp_id },
      data: { attempts: { increment: 1 } },
    });

    throw new AppError("Invalid Code", 400);
  }

  await OTPManage.update("otp_id", otp.otp_id, {
    is_used: true,
  });

  let user = await prisma.user.findUnique({
    where: { email },
    select: {
      user_id: true,
      email: true,
      Profile: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
      role: {
        select: {
          role_id: true,
          name: true,
          rolePermissions: {
            select: {
              Permission: {
                select: { name: true },
              },
              permission_id: true,
            },
          },
        },
      },
      organization: {
        select: {
          organization_id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("Email Address is not found", 404);
  }
  await DeviceSessionManage.create({
    device_name: deviceSession.device_name,
    expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
    browser: deviceSession.browser,
    os: deviceSession.os,
    device_type: deviceSession.device_type,
    user_agent: deviceSession.user_agent,
    ip_address: deviceSession.ip_address,
    is_deleted: false,
    is_revoked: false,
    user: { connect: { user_id: user.user_id } },
  });

  const permissions = user?.role?.rolePermissions.map(
    ({ Permission }) => Permission.name,
  );

  console.log("PERMISSIONS: ", permissions);

  const token = jwt.sign(
    {
      email: user.email,
      user_id: user.user_id,
      role: user?.role?.name,
      permissions,
    },
    (process.env.JWT_SECRET as string) || "testing",
    {
      algorithm: "HS512",
      expiresIn: "1d",
    },
  );

  return {
    token,
    user,
  };
};

export const AuthLogout = async (id: string) => {
  const user = await UserManage.readById(id, "user_id");

  await ActivityLogManage.create({
    type: "Logged Out",
    decription: "User logged out of the system.",
    user: { connect: { user_id: user?.user_id } },
  });

  return { user };
};

export const GetDeviceSessions = async ({
  after,
  before,
  filter: { orderBy, sortBy },
  limit,
  user_id,
}: DeviceSessionInterface) => {
  let where: DeviceSessionWhereInput = {
    is_deleted: false,
    user: {
      user_id,
    },
  };
  return await DeviceSessionManage.read({
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
      browser: true,
      device_name: true,
      device_sessions_id: true,
      device_type: true,
      expired_at: true,
      ip_address: true,
      is_revoked: true,
      os: true,
      user_agent: true,
      user: {
        select: { user_id: true },
      },
    },
  });
};

export const GetResendOTP = async (email: string, deviceSession: any) => {
  const user = await UserManage.unique("email", email);

  if (!user) {
    throw new AppError("Email address is not found ", 400);
  }

  const profile = await prisma.profile.findFirst({
    where: {
      User: { email },
    },
  });
  const fullname =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();

  await authQueue.add(
    email,
    {
      email: email,
      fullname,
      ip: deviceSession.ip_address,
      userAgent: deviceSession.user_agent,
    },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
    },
  );

  return {
    email,
    success: true,
  };
};

export const AuthVerified = async (token: string) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    user_id: string;
    email: string;
    type: string;
  };

  if (payload.type !== "email-verification") {
    throw new Error("Invalid verification token.");
  }

  const user = await UserManage.readById(payload.user_id, "user_id");

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.is_active) {
    return user;
  }

  return UserManage.update("user_id", payload.user_id, {
    is_active: true,
  });
};

export const AuthRegister = async (data: any) => {
  const user = await UserManage.create({
    email: data.email,

    Profile: {
      create: {
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
      },
    },

    role: {
      connect: {
        role_id: data.role_id,
      },
    },

    ...(data.organization_id && {
      organization: {
        connect: {
          organization_id: data.organization_id,
        },
      },
    }),
  });

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      type: "email-verification",
    },
    jwtSecret,
  );

  await authVerified.add(
    "registration-email",
    {
      email: user.email,
      token,
    },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
    },
  );

  return {
    user,
    success: true,
  };
};
