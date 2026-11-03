import {
  createOrganization,
  getAllOrganization,
  softDeleteOrganization,
  updateOrganizatoin,
} from "../controller/organization.controller.js";
import { asyncHandler } from "../lib/common/middleware.ts/asyncHandler.js";
import { withAuth } from "../lib/helpers/useAuth.js";
import upload from "../lib/helpers/useMulter.js";
import { withPermission } from "../lib/helpers/usePermission.js";
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
