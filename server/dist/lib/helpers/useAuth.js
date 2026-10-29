"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAuth = withAuth;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const VALID_API_KEYS = (process.env.API_KEYS || "testing").split(",");
function withAuth(req, res, next) {
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
    const apiKey = req.headers["x-api-key"];
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            algorithms: ["HS512"],
        });
        req.user = decoded;
        req.apiKey = apiKey;
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}
