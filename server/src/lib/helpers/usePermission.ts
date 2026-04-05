import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      UserPayload?: any;
    }
  }
}

export function checkPermission(user: any, resource: string, action: string) {
  if (!user) {
    return { allowed: false };
  }

  if (user.role === "admin") {
    return { allowed: true };
  }

  const permissions = user.permissions || [];

  const hasPermission = permissions.some((perm: any) => {
    return perm.resource === resource && perm.actions.includes(action);
  });

  return { allowed: hasPermission };
}

export const withPermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { allowed } = checkPermission(req.user, resource, action);

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      console.error("PERMISSION ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};
