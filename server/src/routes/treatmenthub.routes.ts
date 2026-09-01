import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";
import express from "express";
import {
  createTreatmentHub,
  getAllTreatmentHub,
  getTreatmentHubById,
} from "@/controller/treatment-hub.controller";

const router = express.Router();

router.get("/", getAllTreatmentHub);
router.get("/:id", getTreatmentHubById);
router.post(
  "/",
  withAuth,
  withPermission("treatment-hub:create"),
  createTreatmentHub,
);
router.patch("/:id", withAuth, withPermission("treatment-hub:update"));

export default router;
