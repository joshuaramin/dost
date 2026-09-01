import { Login, Logout, VerifyOTP } from "@/controller/auth.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import express from "express";

const router = express.Router();

router.post("/login", asyncHandler(Login));
router.post("/verification", asyncHandler(VerifyOTP));
router.post("/logout/:id", asyncHandler(Logout));

export default router;
