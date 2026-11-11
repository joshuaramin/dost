import {
  getAllUsers,
  getUserById,
  createUser,
  softDeleteUser,
  updateUser,
  updateUserProfile,
  userLanguage,
} from "../controller/user.controller.js";
import { asyncHandler } from "../lib/common/middleware.ts/asyncHandler.js";
import { withAuth } from "../lib/helpers/useAuth.js";
import { withPermission } from "../lib/helpers/usePermission.js";
import upload from "../lib/helpers/useMulter.js";

import express from "express";

const router = express.Router();

//Get
router.get("/", withAuth, asyncHandler(getAllUsers));

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

router.patch("/:id", withAuth, asyncHandler(updateUser));

router.patch("/:id/language", withAuth, asyncHandler(userLanguage));
router.patch(
  "/:id/avatar",
  withAuth,
  upload.single("image_url"),
  asyncHandler(updateUserProfile),
);

router.put(
  "/:id",
  withAuth,
  withPermission("user-management:update"),
  asyncHandler(softDeleteUser),
);

export default router;
