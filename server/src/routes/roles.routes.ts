import {
  addRolePermission,
  createRoles,
  getAllRoles,
  getRoleBySlug,
  softDeleteRoles,
} from "@/controller/roles.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/", withAuth, asyncHandler(getAllRoles));
router.post("/", withAuth, asyncHandler(createRoles));
router.get("/:id", withAuth, asyncHandler(getRoleBySlug));
router.patch("/:id", withAuth, asyncHandler(softDeleteRoles));
router.put("/addRolePermission/:id", asyncHandler(addRolePermission));

export default router;
