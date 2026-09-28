import {
  DeviceSessions,
  Login,
  Logout,
  VerifyOTP,
  Registration,
  ResendOTP,
  Verified,
} from "@/controller/auth.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/device-sessions/:id", withAuth, asyncHandler(DeviceSessions));
router.post("/login", asyncHandler(Login));
router.post("/verification", asyncHandler(VerifyOTP));
router.post("/verified", asyncHandler(Verified));
router.post("/logout/:id", asyncHandler(Logout));
router.post("/registration", asyncHandler(Registration));
router.post("/resend-otp", asyncHandler(ResendOTP));

export default router;
