import {
  addRolePermission,
  createRoles,
  getAllRoles,
  getRoleBySlug,
  softDeleteRoles,
} from "@/controller/roles.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";
import express from "express";

const router = express.Router();

//Get
router.get("/", withAuth, asyncHandler(getAllRoles));
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

//Put
router.put(
  "/addRolePermission/:id",
  withAuth,
  withPermission("roles-and-permissions:update"),
  asyncHandler(addRolePermission),
);

export default router;
