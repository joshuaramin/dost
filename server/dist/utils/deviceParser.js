import { UAParser } from "ua-parser-js";
export const getDeviceInfo = (req) => {
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser(userAgent);
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
