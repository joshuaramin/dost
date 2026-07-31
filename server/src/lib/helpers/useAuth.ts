import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const VALID_API_KEYS = (process.env.API_KEYS || "testing").split(",");

export interface UserPayload {
  user_id: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
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
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is missing.");

    return res.status(500).json({
      message: "JWT configuration error",
    });
  }

  if (!req.apiVersionInfo?.served) {
    return res.status(400).json({
      message: "API version not resolved",
    });
  }

  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({
      message: "Invalid API key",
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS512"],
    }) as UserPayload;

    req.user = decoded;
    req.apiKey = apiKey;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
