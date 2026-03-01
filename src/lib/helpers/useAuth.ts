import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const VALID_API_KEYS = (process.env.API_KEYS || "testing").split(",");

export interface UserPayload {
  user_id: string;
  email: string;
  role?: string;
  is_active: boolean;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      apiVersionInfo?: {
        requested: string | null;
        served: string;
        deprecated: boolean;
        sunsetDate?: string | null;
      };
      apiKey?: string;
    }
  }
}

export function withAuth(req: Request, res: Response, next: NextFunction) {
  const version =
    req.apiVersionInfo?.served || (req.headers["x-api-version"] as string);
  if (!version) {
    return res.status(400).json({ message: "API version required" });
  }

  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as UserPayload;

    if (!user.is_active) {
      return res
        .status(403)
        .json({ message: "Your account is not activated." });
    }

    req.user = user;
    req.apiKey = apiKey;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
