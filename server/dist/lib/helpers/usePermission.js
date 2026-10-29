"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPermission = void 0;
exports.checkPermission = checkPermission;
function checkPermission(user, permissions, mode = "OR") {
    if (!user) {
        return false;
    }
    // Super Administrator bypass
    if (user.role === "Super Administrator") {
        return true;
    }
    const userPermissions = user.permissions ?? [];
    if (mode === "AND") {
        return permissions.every((permission) => userPermissions.includes(permission));
    }
    return permissions.some((permission) => userPermissions.includes(permission));
}
const withPermission = (permissions, mode = "OR") => (req, res, next) => {
    try {
        const requiredPermissions = Array.isArray(permissions)
            ? permissions
            : [permissions];
        if (requiredPermissions.length === 0) {
            return res.status(500).json({
                success: false,
                message: "No permissions configured",
            });
        }
        const allowed = checkPermission(req.user, requiredPermissions, mode);
        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions",
            });
        }
        return next();
    }
    catch (error) {
        console.error("PERMISSION ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Permission check failed",
        });
    }
};
exports.withPermission = withPermission;
