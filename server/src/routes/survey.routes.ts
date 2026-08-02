import {
  createQuestionById,
  createSurvey,
  getAllSurvey,
  getSurveyById,
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
router.post(
  "/:id",
  withPermission("survey-management:update"),
  asyncHandler(createQuestionById),
);
router.get(
  "/:id",
  withPermission("survey-management:update"),
  asyncHandler(getSurveyById),
);

export default router;
