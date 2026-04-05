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
  if (!req.apiVersionInfo?.served) {
    return res.status(400).json({ message: "API version not resolved" });
  }
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, "testing", {
      algorithms: ["HS512"],
    }) as UserPayload;

    req.user = user;
    req.apiKey = apiKey;

    next();
  } catch (err) {
    console.error("JWT verification failed", {
      error: err instanceof Error ? err.message : err,
    });

    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
