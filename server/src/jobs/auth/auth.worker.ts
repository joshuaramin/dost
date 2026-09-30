import "dotenv/config";
import { Worker } from "bullmq";
import nodemailer from "nodemailer";

import { connection } from "@/lib/redis";
import { renderOTPTemplate } from "@/lib/emails/rendered/otpRendered";
import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { OTP } from "@/lib/prisma/system/generated/prisma/browser";
import { prisma } from "@/lib/prisma/system/prisma";
import { AppError } from "@/lib/common/appError";
import { generateOTP, hashOTP } from "@/utils/otpGenerator";
import { renderWelcome } from "@/lib/emails/rendered/welcomeRendered";

const OTPManage = new PrismaCRUDManager<OTP, "otp_id", typeof prisma.oTP>(
  prisma.oTP,
  "otp_id",
);

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("SMTP credentials are not configured");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "Oauth2",
    user: process.env.SMTP_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// Optional: test SMTP connection when worker starts
transporter
  .verify()
  .then(() => {
    console.log("✅ SMTP server is ready");
  })
  .catch((error) => {
    console.error("❌ SMTP connection failed:", error);
  });

export const authWorker = new Worker(
  "auth",
  async (job) => {
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

    // Invalidate old unused OTPs
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
      const info = await transporter.sendMail({
        from: `"Advocaid PH" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "One-Time Password",
        html,
      });

      console.log("✅ OTP EMAIL SENT:", info.messageId);
    } catch (error) {
      console.error("❌ OTP EMAIL FAILED:", error);

      throw new AppError("Failed to send OTP email.", 500);
    }
  },
  {
    connection,
  },
);

export const authVerified = new Worker(
  "registration-email",
  async (job) => {
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

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.PRODUCTION_URL
        : process.env.DEVELOPMENT_URL;

    if (!baseUrl) {
      throw new Error("Application URL is not configured");
    }

    const activationUrl = `${baseUrl}/auth/verified?token=${encodeURIComponent(token)}`;

    const html = await renderWelcome(fullname, activationUrl);

    try {
      const info = await transporter.sendMail({
        from: `"Advocaid PH" <${process.env.SMTP_USER}>`,
        to: profile.email,
        subject: "Account Verification",
        html,
      });

      console.log(
        `✅ EMAIL VERIFICATION SENT: ${profile.email}`,
        info.messageId,
      );
    } catch (error) {
      console.error("❌ VERIFICATION EMAIL FAILED:", error);

      throw new AppError("Failed to send verification email.", 500);
    }
  },
  {
    connection,
  },
);

console.log("🚀 EMAIL WORKER FILE EXECUTED");
