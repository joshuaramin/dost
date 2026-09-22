import {
  CreateUserSchema,
  RegisterUserSchema,
  UserSchema,
} from "@/lib/validation/user.validation";
import {
  AuthLogin,
  AuthLogout,
  AuthRegister,
  AuthVerfiy,
  GetDeviceSessions,
  GetResendOTP,
} from "@/services/auth.services";
import { getDeviceInfo } from "@/utils/deviceParser";
import { Response, Request } from "express";

import UAPARSER from "ua-parser-js";

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

export const Login = async (request: Request, response: Response) => {
  const deviceInfo = getDeviceInfo(request);

  const result = await AuthLogin(request.body, deviceInfo);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const VerifyOTP = async (request: Request, response: Response) => {
  const deviceInfo = getDeviceInfo(request);

  const email = String(request.query.email);

  const result = await AuthVerfiy(email, request.body, deviceInfo);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export async function Logout(request: Request, response: Response) {
  const userId = String(request.params.id);
  const result = await AuthLogout(userId);

  return response
    .status(200)
    .json({ data: result, message: "Logged out successfully" });
}

export const DeviceSessions = async (request: Request, response: Response) => {
  const userId = String(request.params.id);

  const { orderBy, sortBy, after, before, limit, search } = request.query;

  const result = await GetDeviceSessions({
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    limit: limit as string,
    user_id: userId,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const ResendOTP = async (request: Request, response: Response) => {
  const deviceInfo = getDeviceInfo(request);

  const email = String(request.query.email);

  const result = await GetResendOTP(email, deviceInfo);
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const Registration = async (request: Request, response: Response) => {
  const body = request.body;
  const parsedData = RegisterUserSchema.safeParse(body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: parsedData.error.flatten(),
      success: false,
      timestamp: new Date(),
    });
  }

  const result = await AuthRegister(parsedData.data);

  return response.status(200).json({
    ...result,
    success: true,
    timestamp: new Date(),
  });
};
