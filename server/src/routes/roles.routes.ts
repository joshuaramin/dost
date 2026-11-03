import {
  addRolePermission,
  createRoles,
  getAllRoles,
  getRoleBySlug,
  softDeleteRoles,
  updateRoles,
} from "../controller/roles.controller.js";
import { asyncHandler } from "../lib/common/middleware.ts/asyncHandler.js";
import { withAuth } from "../lib/helpers/useAuth.js";
import { withPermission } from "../lib/helpers/usePermission.js";
import express from "express";

const router = express.Router();

//Get
router.get("/", asyncHandler(getAllRoles));
router.get("/:slug", withAuth, asyncHandler(getRoleBySlug));

//Post
router.post(
  "/",
  withAuth,
  withPermission("roles-and-permissions:create"),
  asyncHandler(createRoles),
);

//Patch
router.patch(
  "/:id",
  withAuth,
  withPermission("roles-and-permissions:update"),
  asyncHandler(softDeleteRoles),
);

router.put("/:id", withAuth, asyncHandler(updateRoles));

//Put
router.put(
  "/addRolePermission/:id",
  withAuth,
  withPermission("roles-and-permissions:update"),
  asyncHandler(addRolePermission),
);

export default router;
