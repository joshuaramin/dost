import {
  createOrganization,
  getAllOrganization,
  softDeleteOrganization,
  updateOrganizatoin,
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

//Put
router.patch("/:id", withAuth, asyncHandler(softDeleteOrganization));
//Patch

router.put(
  "/:id",
  withAuth,
  withPermission("organization-management:update"),
  updateOrganizatoin,
);

export default router;
