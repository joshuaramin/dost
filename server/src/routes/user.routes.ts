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
  withPermission("user-management:read"),
  asyncHandler(getAllUsers),
);

router.get(
  "/:id",
  withAuth,
  withPermission("user-management:read"),
  asyncHandler(getUserById),
);

//Post

router.post(
  "/",
  withAuth,
  withPermission("user-management:create"),
  asyncHandler(createUser),
);

//Patch

router.patch(
  "/:id",
  withAuth,
  withPermission("user-management:update"),
  asyncHandler(softDeleteUser),
);

export default router;
