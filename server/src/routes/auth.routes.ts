import {
  DeviceSessions,
  Login,
  Logout,
  VerifyOTP,
} from "@/controller/auth.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/device-sessions/:id", withAuth, asyncHandler(DeviceSessions));
router.post("/login", asyncHandler(Login));
router.post("/verification", asyncHandler(VerifyOTP));
router.post("/logout/:id", asyncHandler(Logout));

export default router;
