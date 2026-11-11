import { createTreatmentHubService, getAllTreatmentHubService, } from "../controller/services.controller.js";
import { asyncHandler } from "../lib/common/middleware.ts/asyncHandler.js";
import { withAuth } from "../lib/helpers/useAuth.js";
import express from "express";
const router = express.Router();
router.get("/", withAuth, asyncHandler(getAllTreatmentHubService));
router.post("/", withAuth, asyncHandler(createTreatmentHubService));
export default router;
