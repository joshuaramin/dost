import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "../../lib/redis/index.js";
import { renderOTPTemplate } from "../../lib/emails/rendered/otpRendered.js";
import { renderWelcome } from "../../lib/emails/rendered/welcomeRendered.js";
import { PrismaCRUDManager } from "../../lib/helpers/useCrud.js";
import { prisma } from "../../lib/prisma/system/prisma.js";
import { AppError } from "../../lib/common/appError.js";
import { generateOTP, hashOTP } from "../../utils/otpGenerator.js";
const OTPManage = new PrismaCRUDManager(prisma.oTP, "otp_id");
const SENDLIB_URL = "https://sendliberty.com/api/send";
const SENDLIB_KEY = process.env.SENDLIB_KEY;
const SENDLIB_FROM_EMAIL = process.env.SENDLIB_FROM_EMAIL;
if (!SENDLIB_KEY) {
    throw new Error("SENDLIB_KEY is not configured");
}
if (!SENDLIB_FROM_EMAIL) {
    throw new Error("SENDLIB_FROM_EMAIL is not configured");
}
async function sendEmail({ to, subject, html, }) {
    const response = await fetch(SENDLIB_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SENDLIB_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: `Advocaid PH <niceradvocaid@gmail.com>`,
            to,
            subject,
            html,
        }),
        signal: AbortSignal.timeout(15_000),
    });
    const responseText = await response.text();
    let result;
    try {
        result = responseText ? JSON.parse(responseText) : null;
    }
    catch {
        result = responseText;
    }
    if (!response.ok) {
        console.error("Sendliberty API request failed:", {
            status: response.status,
            response: result,
        });
        throw new Error(`Sendliberty API returned HTTP ${response.status}`);
    }
    console.log(`Email request accepted for ${to}.`);
    return result;
}
export const authWorker = new Worker("auth", async (job) => {
    const { fullname, ip, email, userAgent } = job.data;
    const recent = await prisma.oTP.count({
        where: {
            identifier: email,
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
            is_used: false,
        },
        data: {
            is_used: true,
        },
    });
    const code = generateOTP();
    const code_hash = hashOTP(code);
    await OTPManage.create({
        identifier: email,
        type: "login",
        code_hash,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
        ip_address: ip,
        user_agent: userAgent,
    });
    const html = await renderOTPTemplate(fullname, code);
    try {
        const result = await sendEmail({
            to: email,
            subject: "One-Time Password",
            html,
        });
        return result;
    }
    catch (error) {
        console.error("OTP email delivery request failed:", error);
        throw new AppError("Failed to send OTP email.", 500);
    }
}, {
    connection,
});
export const authVerified = new Worker("registration-email", async (job) => {
    const { email, token } = job.data;
    const profile = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            email: true,
            Profile: {
                select: {
                    first_name: true,
                    last_name: true,
                },
            },
        },
    });
    if (!profile) {
        throw new Error(`User not found: ${email}`);
    }
    const fullname = [profile.Profile?.first_name, profile.Profile?.last_name]
        .filter(Boolean)
        .join(" ");
    const baseUrl = process.env.NODE_ENV === "production"
        ? process.env.PRODUCTION_URL
        : process.env.DEVELOPMENT_URL;
    if (!baseUrl) {
        throw new Error("Application URL is not configured");
    }
    const activationUrl = `${baseUrl}/auth/verified?token=${encodeURIComponent(token)}`;
    const html = await renderWelcome(fullname, activationUrl);
    try {
        const result = await sendEmail({
            to: profile.email,
            subject: "Account Verification",
            html,
        });
        return result;
    }
    catch (error) {
        console.error("Account verification email request failed:", error);
        throw new AppError("Failed to send verification email.", 500);
    }
}, {
    connection,
});
authWorker.on("error", (error) => {
    console.error("[Auth Worker] Error:", error.message);
});
authVerified.on("error", (error) => {
    console.error("[Registration Worker] Error:", error.message);
});
console.log("🚀 Email workers initialized");
