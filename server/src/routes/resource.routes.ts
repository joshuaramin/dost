import express from "express";
import {
  addSubResource,
  createResource,
  getAllResource,
  getResourceById,
  softDeleteResource,
} from "@/controller/resource.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";

const router = express.Router();

// Get
router.get("/", asyncHandler(getAllResource));
router.get("/:id", withAuth, asyncHandler(getResourceById));

//Post
router.post("/", asyncHandler(createResource));

//Patch
router.patch("/:id", withAuth, asyncHandler(softDeleteResource));
router.patch("/addResource/:id", withAuth, asyncHandler(addSubResource));

//Put

export default router;
