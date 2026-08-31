import {
  createQuestionById,
  createSurvey,
  deleteSurveyQuestionBytId,
  getAllSurvey,
  getSurveyById,
  updateSurveyQuestionById,
} from "@/controller/survey.conrtoller";

import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";
import express from "express";

const router = express.Router();

router.get(
  "/",
  withAuth,
  withPermission("survey-management:read"),
  asyncHandler(getAllSurvey),
);
router.post(
  "/",
  withAuth,
  withPermission("survey-management:create"),
  asyncHandler(createSurvey),
);

router.post("/:id", asyncHandler(createQuestionById));

router.patch("/question/:id", withAuth, asyncHandler(updateSurveyQuestionById));

router.patch("/:id", withAuth, asyncHandler(deleteSurveyQuestionBytId));

router.get("/:id", asyncHandler(getSurveyById));

export default router;
