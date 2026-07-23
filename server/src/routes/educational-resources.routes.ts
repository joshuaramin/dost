import express from "express";
import {
  createEducationResources,
  createEducationCategory,
  createEducationTag,
  getAllEducationResources,
  getEducationById,
  getAllEducationCategory,
  getEducationTag,
} from "@/controller/educational-resources.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import upload from "@/lib/helpers/useMulter";

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
  upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "attachments" }]),
  asyncHandler(createEducationResources),
);
router.post("/tag", withAuth, asyncHandler(createEducationTag));
router.post(
  "/category",
  withAuth,
  asyncHandler(createEducationCategory),
);

//Put
router.put("/:id", withAuth);

//Patch
router.patch("/:id", withAuth);

export default router;
