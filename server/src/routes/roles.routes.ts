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

//Get
router.get("/", withAuth, asyncHandler(getAllRoles));
router.get("/:slug", withAuth, asyncHandler(getRoleBySlug));

//Post
router.post("/", withAuth, asyncHandler(createRoles));

//Patch
router.patch("/:id", withAuth, asyncHandler(softDeleteRoles));

//Put
router.put("/addRolePermission/:id", asyncHandler(addRolePermission));

export default router;
