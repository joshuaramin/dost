import {
  createQuestionById,
  createSurvey,
  createSurveyResponse,
  deleteSurveyQuestionBytId,
  getAllSurvey,
  getSurveyById,
  getSurvreyResponseById,
  softDeleteSurvey,
  surveyPublished,
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
router.get("/:id", withAuth, asyncHandler(getSurveyById));

router.get(
  "/response/:id",
  withAuth,
  asyncHandler(getSurvreyResponseById),
  withPermission("survey-management:read"),
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

router.post("/response/:id", withAuth, asyncHandler(createSurveyResponse));
router.put("/:id", withAuth, asyncHandler(softDeleteSurvey));

router.patch("/publish/:id", withAuth, asyncHandler(surveyPublished));

export default router;
