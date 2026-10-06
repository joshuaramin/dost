import express from "express";
import {
  createForm,
  getAllForms,
  getFormById,
} from "@/controller/form.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";

const router = express.Router();

router.get("/", withAuth, asyncHandler(getAllForms));
router.get("/:id", withAuth, asyncHandler(getFormById));
router.post("/", withAuth, asyncHandler(createForm));

export default router;
