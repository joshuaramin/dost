import { Request, Response, NextFunction } from "express";

export function checkPermission(
  user: Express.Request["user"],
  permission: string,
) {
  if (!user) {
    return false;
  }

  // Super Administrator bypass
  if (user.role === "Super Administrator") {
    return true;
  }

  return user.permissions.includes(permission);
}

export const withPermission =
  (permission: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const allowed = checkPermission(req.user, permission);

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
