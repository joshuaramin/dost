import express from "express";
import {
  createResource,
  getAllResource,
  getResourceById,
  softDeleteResource,
} from "@/controller/resource.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";

const router = express.Router();

router.get("/", asyncHandler(getAllResource));
router.get("/:id", withAuth, asyncHandler(getResourceById));
router.post("/", asyncHandler(createResource));
router.patch("/:id", withAuth, asyncHandler(softDeleteResource));

export default router;
