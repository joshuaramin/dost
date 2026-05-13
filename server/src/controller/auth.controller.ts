import { AuthLogin, AuthLogout, AuthVerfiy } from "@/services/auth.services";
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
