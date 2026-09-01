import express from "express";
import {
  createEducationResources,
  createEducationCategory,
  createEducationTag,
  getAllEducationResources,
  getEducationById,
  getAllEducationCategory,
  getEducationTag,
  softDeleteEducationResource
} from "@/controller/educational-resources.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import upload from "@/lib/helpers/useMulter";
import { withPermission } from "@/lib/helpers/usePermission";

const router = express.Router();

//Get
router.get("/tag", asyncHandler(getEducationTag));
router.get("/category", asyncHandler(getAllEducationCategory));
router.get("/", asyncHandler(getAllEducationResources));
router.get("/:id", asyncHandler(getEducationById));

//Post
router.post(
  "/",
  withAuth,
  withPermission("educational-resource:create"),
  upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "attachments" }]),
  asyncHandler(createEducationResources),
);
router.post(
  "/tag",
  withAuth,
  withPermission("educational-resource:create"),
  asyncHandler(createEducationTag),
);
router.post(
  "/category",
  withAuth,
  withPermission("educational-resource:create"),
  asyncHandler(createEducationCategory),
);

//Put
router.put("/:id", withAuth, withPermission("educational-resource:update"));

//Patch
router.patch(
  "/:id",
  withAuth,
  withPermission("educational-resources:update"),
  asyncHandler(softDeleteEducationResource),
);

export default router;
