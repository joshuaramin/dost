import {
  createTreatmentHubService,
  getAllTreatmentHubService,
} from "@/controller/services.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/", withAuth, asyncHandler(getAllTreatmentHubService));
router.post("/", withAuth, asyncHandler(createTreatmentHubService));

export default router;
