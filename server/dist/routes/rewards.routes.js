"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const rewards_controller_1 = require("../controller/rewards.controller.js");
const useAuth_1 = require("../lib/helpers/useAuth.js");
const asyncHandler_1 = require("../lib/common/middleware.ts/asyncHandler.js");
const router = express_1.default.Router();
//reward
router.get("/", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.getAllRewardLevel));
router.get("/badge", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.getAllBadge));
router.get("/rule", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.getAllRewardPointRule));
router.get("/badge/:id", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.getBadgeId));
router.get("/:id", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.getRewardLevelById));
router.post("/", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.createReward));
router.patch("/:id", () => { });
router.put("/:id", () => { });
//rule
router.post("/rule", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.createRuleReward));
//badge
router.post("/badge", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(rewards_controller_1.createBadge));
router.patch("/badge/:id", () => { });
router.put("/badge/:id", () => { });
exports.default = router;
