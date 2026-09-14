import {
  getAllActivityLogs,
  createActivityLgos,
} from "@/controller/log.controller";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/:id", withAuth, asyncHandler(getAllActivityLogs));
router.post("/", asyncHandler(createActivityLgos));

export default router;
