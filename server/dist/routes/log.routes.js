import { getAllActivityLogs, createActivityLgos, } from "../controller/log.controller.js";
import { asyncHandler } from "../lib/common/middleware.ts/asyncHandler.js";
import { withAuth } from "../lib/helpers/useAuth.js";
import express from "express";
const router = express.Router();
router.get("/:id", withAuth, asyncHandler(getAllActivityLogs));
router.post("/", asyncHandler(createActivityLgos));
export default router;
