import express from "express";
import {
  createBadge,
  getAllBadge,
  getAllRewardLevel,
  getBadgeId,
  getRewardLevelById,
  createReward,
  createRuleReward,
  getAllRewardPointRule,
} from "@/controller/rewards.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { asyncHandler } from "@/lib/common/middleware.ts/asyncHandler";

const router = express.Router();

//reward
router.get("/", asyncHandler(getAllRewardLevel));
router.get("/:id", asyncHandler(getRewardLevelById));
router.post("/", asyncHandler(createReward));
router.patch("/:id", () => {});
router.put("/:id", () => {});

//rule
router.get("/rule", asyncHandler(getAllRewardPointRule));
router.post("/rule", asyncHandler(createRuleReward));

//badge
router.get("/badge", asyncHandler(getAllBadge));
router.get("/badge/:id", asyncHandler(getBadgeId));
router.post("/badge", asyncHandler(createBadge));
router.patch("/badge/:id", () => {});
router.put("/badge/:id", () => {});

export default router;
