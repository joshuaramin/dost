import {
  createOrganization,
  getAllOrganization,
  softDeleteOrganization,
} from "@/controller/organization.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import upload from "@/lib/helpers/useMulter";
import { withPermission } from "@/lib/helpers/usePermission";
import express from "express";

const router = express.Router();

//Get
router.get("/", getAllOrganization);

//Post
router.post(
  "/",
  withAuth,
  withPermission("organization-management:create"),
  upload.single("logo"),
  createOrganization,
);

// //Put
router.put("/:id", withAuth, asyncHandler(softDeleteOrganization));
//Patch
router.patch(
  "/:id",
  withAuth,
  withPermission("organization-management:update"),
);

export default router;
