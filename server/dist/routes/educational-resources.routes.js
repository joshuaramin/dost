import express from "express";
import { createEducationResources, createEducationCategory, createEducationTag, getAllEducationResources, getEducationById, getAllEducationCategory, getEducationTag, softDeleteEducationResource, updateEducationResource, } from "../controller/educational-resources.controller.js";
import { withAuth } from "../lib/helpers/useAuth.js";
import { asyncHandler } from "../lib/common/middleware.ts/asyncHandler.js";
import upload from "../lib/helpers/useMulter.js";
import { withPermission } from "../lib/helpers/usePermission.js";
const router = express.Router();
//Get
router.get("/tag", asyncHandler(getEducationTag));
router.get("/category", asyncHandler(getAllEducationCategory));
router.get("/", asyncHandler(getAllEducationResources));
router.get("/:id", asyncHandler(getEducationById));
//Post
router.post("/", withAuth, withPermission("educational-resource:create"), upload.fields([{ name: "attachments" }]), asyncHandler(createEducationResources));
router.post("/tag", withAuth, withPermission("educational-resource:create"), asyncHandler(createEducationTag));
router.post("/category", withAuth, withPermission("educational-resource:create"), asyncHandler(createEducationCategory));
//Put
router.put("/:slug", withAuth, withPermission("educational-resource:update"), upload.fields([{ name: "attachments" }]), asyncHandler(updateEducationResource));
//Patch
router.patch("/:id", withAuth, withPermission("educational-resources:update"), asyncHandler(softDeleteEducationResource));
export default router;
