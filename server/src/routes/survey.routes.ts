import {
  createQuestionById,
  createSurvey,
  getAllSurvey,
  getSurveyById,
} from "@/controller/survey.conrtoller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/", asyncHandler(getAllSurvey));
router.post("/", asyncHandler(createSurvey));
router.post("/:id", asyncHandler(createQuestionById));
router.get("/:id", asyncHandler(getSurveyById));

export default router;
