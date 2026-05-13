import {
  getAllUsers,
  getUserById,
  createUser,
  softDeleteUser,
} from "@/controller/user.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";

import express from "express";

const router = express.Router();

router.get("/", asyncHandler(getAllUsers));
router.get(
  "/:id",
  withAuth,
  withPermission("user", "read"),
  asyncHandler(getUserById),
);
router.post("/", asyncHandler(createUser));
router.patch("/:id", withAuth, asyncHandler(softDeleteUser));

export default router;
