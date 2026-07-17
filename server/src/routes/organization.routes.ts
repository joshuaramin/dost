import {
  createOrganization,
  getAllOrganization,
} from "@/controller/organization.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import upload from "@/lib/helpers/useMulter";
import express from "express";

const router = express.Router();

//Get
router.get("/", getAllOrganization);

//Post
router.post("/", withAuth, upload.single("logo"), createOrganization);

//Put
router.put("/:id", withAuth);

//Patch
router.patch("/:id", withAuth);

export default router;
