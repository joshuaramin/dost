import "dotenv/config";
import jwt from "jsonwebtoken";
import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
import { AppError } from "../lib/common/appError.js";
import { generateOTP, hashOTP } from "../utils/otpGenerator.js";
import { renderOTPTemplate } from "../lib/emails/templates/advocaid-otp.js";
import { renderWelcomeTemplate } from "../lib/emails/templates/adovocaid-welcome.js";
import { sendEmail } from "../lib/emails/sendEmail.js";
const UserManage = new PrismaCRUDManager(prisma.user, "user_id");
const OTPManage = new PrismaCRUDManager(prisma.oTP, "otp_id");
const DeviceSessionManage = new PrismaCRUDManager(prisma.deviceSession, "device_sessions_id");
const ActivityLogManage = new PrismaCRUDManager(prisma.activityLog, "activity_logs_id");
const sendLoginOTP = async (email, fullname, deviceSession) => {
    const recent = await prisma.oTP.count({
        where: {
            identifier: email,
            type: "login",
            created_at: {
                gte: new Date(Date.now() - 60 * 1000),
            },
        },
    });
    if (recent >= 3) {
        throw new AppError("Too many requests. Try again later.", 429);
    }
    await prisma.oTP.updateMany({
        where: {
            identifier: email,
            type: "login",
            is_used: false,
        },
        data: {
            is_used: true,
        },
    });
    const code = generateOTP();
    const code_hash = hashOTP(code);
    const otp = await OTPManage.create({
        identifier: email,
        type: "login",
        code_hash,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
        ip_address: deviceSession.ip_address,
        user_agent: deviceSession.user_agent,
    });
    try {
        const html = await renderOTPTemplate(fullname, code);
        await sendEmail({
            to: email,
            subject: "One-Time Password",
            html,
        });
        return {
            email,
            success: true,
        };
    }
    catch (error) {
        console.error("OTP email delivery failed:", error);
        await prisma.oTP.update({
            where: {
                otp_id: otp.otp_id,
            },
            data: {
                is_used: true,
            },
        });
        throw new AppError("Failed to send OTP email.", 500);
    }
};
export const AuthLogin = async (data, deviceSession) => {
    const user = await UserManage.unique("email", data.email);
    if (!user) {
        throw new AppError("Email address is not found", 400);
    }
    const profile = await prisma.profile.findFirst({
        where: {
            User: {
                email: data.email,
            },
        },
    });
    const fullname = [profile?.first_name, profile?.last_name]
        .filter(Boolean)
        .join(" ");
    return await sendLoginOTP(data.email, fullname, deviceSession);
};
export const AuthVerfiy = async (email, data, deviceSession) => {
    const hashed = hashOTP(data.code);
    const otp = await prisma.oTP.findFirst({
        where: {
            identifier: email,
            type: "login",
            is_used: false,
        },
        orderBy: {
            created_at: "desc",
        },
    });
    if (!otp) {
        throw new AppError("Invalid or expired OTP", 400);
    }
    if (otp.expires_at < new Date()) {
        throw new AppError("One-Time Password expired", 400);
    }
    if (otp.attempts >= otp.max_attempts) {
        throw new AppError("Too many attempts", 429);
    }
    if (otp.code_hash !== hashed) {
        await prisma.oTP.update({
            where: {
                otp_id: otp.otp_id,
            },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });
        throw new AppError("Invalid Code", 400);
    }
    await OTPManage.update("otp_id", otp.otp_id, {
        is_used: true,
    });
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
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
                                select: {
                                    name: true,
                                },
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
        throw new AppError("Email Address is not found", 404);
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
        user: {
            connect: {
                user_id: user.user_id,
            },
        },
    });
    const permissions = user.role?.rolePermissions.map(({ Permission }) => Permission.name);
    console.log("PERMISSIONS: ", permissions);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured.");
    }
    const token = jwt.sign({
        email: user.email,
        user_id: user.user_id,
        role: user.role?.name,
        permissions,
    }, jwtSecret, {
        algorithm: "HS512",
        expiresIn: "1d",
    });
    return {
        token,
        user,
    };
};
export const AuthLogout = async (id) => {
    const user = await UserManage.readById(id, "user_id");
    await ActivityLogManage.create({
        type: "Logged Out",
        description: "User logged out of the system.",
        user: {
            connect: {
                user_id: user?.user_id,
            },
        },
    });
    return {
        user,
    };
};
export const GetDeviceSessions = async ({ after, before, filter: { orderBy, sortBy }, limit, user_id, }) => {
    const where = {
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
                select: {
                    user_id: true,
                },
            },
        },
    });
};
export const GetResendOTP = async (email, deviceSession) => {
    const user = await UserManage.unique("email", email);
    if (!user) {
        throw new AppError("Email address is not found", 400);
    }
    const profile = await prisma.profile.findFirst({
        where: {
            User: {
                email,
            },
        },
    });
    const fullname = [profile?.first_name, profile?.last_name]
        .filter(Boolean)
        .join(" ");
    return await sendLoginOTP(email, fullname, deviceSession);
};
export const AuthVerified = async (token) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured.");
    }
    const payload = jwt.verify(token, jwtSecret);
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
    return await UserManage.update("user_id", payload.user_id, {
        is_active: true,
    });
};
export const AuthRegister = async (data) => {
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
        Profile: true,
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
        role: {
            select: {
                name: true,
            },
        },
        organization: {
            select: {
                name: true,
            },
        },
        created_at: true,
    });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured.");
    }
    const token = jwt.sign({
        user_id: user.user_id,
        email: user.email,
        type: "email-verification",
    }, jwtSecret, {
        expiresIn: "24h",
    });
    const baseUrl = process.env.NODE_ENV === "production"
        ? process.env.PRODUCTION_URL
        : process.env.DEVELOPMENT_URL;
    if (!baseUrl) {
        throw new Error("Application URL is not configured.");
    }
    const activationUrl = `${baseUrl.replace(/\/+$/, "")}/auth/verified?token=${encodeURIComponent(token)}`;
    const fullname = [data.first_name, data.last_name].filter(Boolean).join(" ");
    try {
        const html = await renderWelcomeTemplate(fullname, activationUrl);
        await sendEmail({
            to: user.email,
            subject: "Account Verification",
            html,
        });
    }
    catch (error) {
        console.error("Registration email delivery failed:", error);
        throw new AppError("Account created, but verification email could not be sent. Please request another verification email.", 500);
    }
    return {
        user,
        success: true,
    };
};
