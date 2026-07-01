import {
  createOrganization,
  getAllOrganization,
} from "@/controller/organization.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import upload from "@/lib/helpers/useMulter";
import express from "express";

const router = express.Router();

router.get("/", getAllOrganization);
router.post("/", withAuth, upload.single("logo"), createOrganization);
router.put("/:id", withAuth);
router.patch("/:id", withAuth);

export default router;
