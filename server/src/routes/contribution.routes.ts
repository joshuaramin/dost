import {
  getAllContributions,
  getContributionById,
  updateContribution,
  createContribution,
} from "@/controller/contribution.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/", withAuth, asyncHandler(getAllContributions));
router.get("/:id", withAuth, asyncHandler(getContributionById));
router.post("/", withAuth, asyncHandler(createContribution));
router.patch("/:id", withAuth, asyncHandler(updateContribution));

export default router;
