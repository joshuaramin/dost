import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "@/lib/redis";
import { renderOTPTemplate } from "@/lib/emails/rendered/otpRendered";
import useSES from "@/lib/helpers/useSES";
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
      throw new AppError("Too many request. Try again later.", 500);
    }

    await prisma.oTP.updateMany({
      where: { identifier: email, is_used: false },
      data: { is_used: true },
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

    await useSES({
      toAddress: [email],
      subject: "One-Time Password",
      html,
    });

    console.log("✅ AFTER SEND EMAIL");
  },
  { connection },
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

    await useSES({
      toAddress: [profile.email],
      subject: "Account Verification",
      html,
    });

    console.log(`EMAIL VERIFICATION SENT: ${profile.email}`);
  },
  {
    connection,
  },
);

console.log("🚀 EMAIL WORKER FILE EXECUTED");
