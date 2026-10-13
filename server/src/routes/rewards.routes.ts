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
router.get("/", withAuth, asyncHandler(getAllRewardLevel));
router.get("/badge", withAuth, asyncHandler(getAllBadge));
router.get("/rule", withAuth, asyncHandler(getAllRewardPointRule));
router.get("/badge/:id", withAuth, asyncHandler(getBadgeId));
router.get("/:id", withAuth, asyncHandler(getRewardLevelById));

router.post("/", withAuth, asyncHandler(createReward));
router.patch("/:id", () => {});
router.put("/:id", () => {});

//rule
router.post("/rule", withAuth, asyncHandler(createRuleReward));

//badge
router.post("/badge", withAuth, asyncHandler(createBadge));
router.patch("/badge/:id", () => {});
router.put("/badge/:id", () => {});

export default router;
