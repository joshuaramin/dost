"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRegister = exports.AuthVerified = exports.GetResendOTP = exports.GetDeviceSessions = exports.AuthLogout = exports.AuthVerfiy = exports.AuthLogin = void 0;
const tslib_1 = require("tslib");
require("dotenv/config");
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const otpGenerator_1 = require("../utils/otpGenerator.js");
const appError_1 = require("../lib/common/appError.js");
const auth_queue_1 = require("../jobs/auth/auth.queue.js");
const UserManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.user, "user_id");
const OTPManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.oTP, "otp_id");
const DeviceSessionManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.deviceSession, "device_sessions_id");
const ActivityLogManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.activityLog, "activity_logs_id");
const AuthLogin = async (data, deviceSession) => {
    const user = await UserManage.unique("email", data.email);
    if (!user) {
        throw new appError_1.AppError("Email address is not found", 400);
    }
    const profile = await prisma_1.prisma.profile.findFirst({
        where: { User: { email: data.email } },
    });
    const fullname = profile?.first_name + " " + profile?.last_name;
    await auth_queue_1.authQueue.add("send-login-otp", {
        email: data.email,
        fullname,
        ip: deviceSession.ip_address,
        userAgent: deviceSession.user_agent,
    }, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: true,
    });
    return { email: data.email, success: true };
};
exports.AuthLogin = AuthLogin;
const AuthVerfiy = async (email, data, deviceSession) => {
    const hashed = (0, otpGenerator_1.hashOTP)(data.code);
    const otp = await prisma_1.prisma.oTP.findFirst({
        where: {
            identifier: email,
            type: "login",
            is_used: false,
        },
        orderBy: { created_at: "desc" },
    });
    if (!otp) {
        throw new appError_1.AppError("Invalid or expired OTP", 400);
    }
    if (otp.expires_at < new Date()) {
        throw new appError_1.AppError("One-Time Password expired", 400);
    }
    if (otp.attempts >= otp.max_attempts) {
        throw new appError_1.AppError("Too many attempts", 429);
    }
    if (otp.code_hash !== hashed) {
        await prisma_1.prisma.oTP.update({
            where: { otp_id: otp.otp_id },
            data: { attempts: { increment: 1 } },
        });
        throw new appError_1.AppError("Invalid Code", 400);
    }
    await OTPManage.update("otp_id", otp.otp_id, {
        is_used: true,
    });
    let user = await prisma_1.prisma.user.findUnique({
        where: { email },
        select: {
            user_id: true,
            email: true,
            Profile: {
                select: {
                    first_name: true,
                    last_name: true,
                },
            },
            role: {
                select: {
                    role_id: true,
                    name: true,
                    rolePermissions: {
                        select: {
                            Permission: {
                                select: { name: true },
                            },
                            permission_id: true,
                        },
                    },
                },
            },
            organization: {
                select: {
                    organization_id: true,
                    name: true,
                },
            },
        },
    });
    if (!user) {
        throw new appError_1.AppError("Email Address is not found", 404);
    }
    await DeviceSessionManage.create({
        device_name: deviceSession.device_name,
        expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
        browser: deviceSession.browser,
        os: deviceSession.os,
        device_type: deviceSession.device_type,
        user_agent: deviceSession.user_agent,
        ip_address: deviceSession.ip_address,
        is_deleted: false,
        is_revoked: false,
        user: { connect: { user_id: user.user_id } },
    });
    const permissions = user?.role?.rolePermissions.map(({ Permission }) => Permission.name);
    console.log("PERMISSIONS: ", permissions);
    const token = jsonwebtoken_1.default.sign({
        email: user.email,
        user_id: user.user_id,
        role: user?.role?.name,
        permissions,
    }, process.env.JWT_SECRET || "testing", {
        algorithm: "HS512",
        expiresIn: "1d",
    });
    return {
        token,
        user,
    };
};
exports.AuthVerfiy = AuthVerfiy;
const AuthLogout = async (id) => {
    const user = await UserManage.readById(id, "user_id");
    await ActivityLogManage.create({
        type: "Logged Out",
        description: "User logged out of the system.",
        user: { connect: { user_id: user?.user_id } },
    });
    return { user };
};
exports.AuthLogout = AuthLogout;
const GetDeviceSessions = async ({ after, before, filter: { orderBy, sortBy }, limit, user_id, }) => {
    let where = {
        is_deleted: false,
        user: {
            user_id,
        },
    };
    return await DeviceSessionManage.read({
        where,
        limit,
        ...(after && {
            cursor: after,
            direction: "forward",
        }),
        ...(before && {
            cursor: before,
            direction: "backward",
        }),
        orderBy: {
            [orderBy]: sortBy,
        },
        select: {
            browser: true,
            device_name: true,
            device_sessions_id: true,
            device_type: true,
            expired_at: true,
            ip_address: true,
            is_revoked: true,
            os: true,
            user_agent: true,
            user: {
                select: { user_id: true },
            },
        },
    });
};
exports.GetDeviceSessions = GetDeviceSessions;
const GetResendOTP = async (email, deviceSession) => {
    const user = await UserManage.unique("email", email);
    if (!user) {
        throw new appError_1.AppError("Email address is not found ", 400);
    }
    const profile = await prisma_1.prisma.profile.findFirst({
        where: {
            User: { email },
        },
    });
    const fullname = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();
    await auth_queue_1.authQueue.add(email, {
        email: email,
        fullname,
        ip: deviceSession.ip_address,
        userAgent: deviceSession.user_agent,
    }, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: true,
    });
    return {
        email,
        success: true,
    };
};
exports.GetResendOTP = GetResendOTP;
const AuthVerified = async (token) => {
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (payload.type !== "email-verification") {
        throw new Error("Invalid verification token.");
    }
    const user = await UserManage.readById(payload.user_id, "user_id");
    if (!user) {
        throw new Error("User not found.");
    }
    if (user.is_active) {
        return user;
    }
    return UserManage.update("user_id", payload.user_id, {
        is_active: true,
    });
};
exports.AuthVerified = AuthVerified;
const AuthRegister = async (data) => {
    const user = await UserManage.create({
        email: data.email,
        Profile: {
            create: {
                first_name: data.first_name,
                last_name: data.last_name,
                location: data.location,
            },
        },
        role: {
            connect: {
                role_id: data.role_id,
            },
        },
        ...(data.organization_id && {
            organization: {
                connect: {
                    organization_id: data.organization_id,
                },
            },
        }),
        userReward: {
            create: {
                total_points: 0,
                current_level_id: "cmuz4i4u90000i6y409gpft64",
            },
        },
    }, {
        user_id: true,
        email: true,
        is_active: true,
        is_deleted: true,
        Profile: {
            select: {
                first_name: true,
                last_name: true,
                location: true,
                image_url: true,
            },
        },
        user_preference: {
            select: {
                created_at: true,
                email_activity_notifications: true,
            },
        },
        userBadges: {
            select: {
                badge_id: true,
                badge: true,
            },
        },
        userReward: {
            select: {
                user_reward_id: true,
                level: true,
                total_points: true,
            },
        },
        role: { select: { name: true } },
        organization: { select: { name: true } },
        created_at: true,
    });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured.");
    }
    const token = jsonwebtoken_1.default.sign({
        user_id: user.user_id,
        email: user.email,
        type: "email-verification",
    }, jwtSecret);
    await auth_queue_1.authVerified.add("registration-email", {
        email: user.email,
        token,
    }, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: true,
    });
    return {
        user,
        success: true,
    };
};
exports.AuthRegister = AuthRegister;
