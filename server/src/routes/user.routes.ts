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

router.get(
  "/",
  withAuth,
  withPermission("user", "read"),
  asyncHandler(getAllUsers),
);
router.get(
  "/:id",
  withAuth,
  withPermission("user", "read"),
  asyncHandler(getUserById),
);
router.post(
  "/",
  withAuth,
  withPermission("user", "create"),
  asyncHandler(createUser),
);
router.patch(
  "/:id",
  withAuth,
  withPermission("user", "update"),
  asyncHandler(softDeleteUser),
);

export default router;
