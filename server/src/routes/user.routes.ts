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

//Get
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

//Post
router.post(
  "/",
  withAuth,
  withPermission("user", "create"),
  asyncHandler(createUser),
);

//Patch
router.patch(
  "/:id",
  withAuth,
  withPermission("user", "update"),
  asyncHandler(softDeleteUser),
);

export default router;
