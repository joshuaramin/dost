"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceInfo = void 0;
const tslib_1 = require("tslib");
const ua_parser_js_1 = tslib_1.__importDefault(require("ua-parser-js"));
const getDeviceInfo = (req) => {
    const userAgent = req.headers["user-agent"] || "";
    const parser = new ua_parser_js_1.default.UAParser(userAgent);
    const ua = parser.getResult();
    return {
        ip_address: req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress ||
            "Unknown",
        device_type: ua.device.type || "Desktop",
        os: ua.os.name || "Unknown",
        browser: ua.browser.name || "Unknown",
        device_name: ua.device.model || "Unknown",
        user_agent: userAgent,
        is_deleted: false,
        is_revoked: false,
    };
};
exports.getDeviceInfo = getDeviceInfo;
