import express from "express";
import {
  createResource,
  getAllResource,
  getResourceById,
  softDeleteResource,
} from "@/controller/resource.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";

const router = express.Router();

router.get("/", withAuth, getAllResource);
router.get("/:id", withAuth, getResourceById);
router.post("/", withAuth, createResource);
router.patch("/:id", withAuth, softDeleteResource);

export default router;
