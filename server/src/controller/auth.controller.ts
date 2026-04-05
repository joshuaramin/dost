import { AuthLogin, AuthLogout } from "@/services/auth.services";
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
  try {
    const userAgent = request.headers["user-agent"] || "";
    const parser = new UAPARSER.UAParser(userAgent);
    const uaResult = parser.getResult();

    const deviceInfo: DeviceSessions = {
      ip_address:
        (request.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        request.socket.remoteAddress ||
        "Unknown",
      device_type: uaResult.device.type || "Desktop",
      os: uaResult.os.name || "Unknown",
      browser: uaResult.browser.name || "Unknown",
      device_name: uaResult.device.model || "Unknown",
      user_agent: userAgent,
      is_deleted: false,
      is_revoked: false,
    };

    console.log("Request Body: ", request.body);
    const result = await AuthLogin(request.body, deviceInfo);

    return response.status(200).json({
      ...result,
      timestamp: new Date(Date.now()),
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};

export async function Logout(request: Request, response: Response) {
  try {
    const userId = String(request.params.id);
    const result = await AuthLogout(userId);

    return response
      .status(200)
      .json({ data: result, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return response.status(500).json({ message: "Server error during logout" });
  }
}
