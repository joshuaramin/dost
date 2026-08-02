import {
  createOrganization,
  getAllOrganization,
} from "@/controller/organization.controller";
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
  withPermission("organization:create"),
  upload.single("logo"),
  createOrganization,
);

//Put
router.put("/:id", withAuth, withPermission("organization:update"));

//Patch
router.patch("/:id", withAuth, withPermission("organization:update"));

export default router;
