"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_controller_1 = require("../controller/user.controller.js");
const asyncHandler_1 = require("../lib/common/middleware.ts/asyncHandler.js");
const useAuth_1 = require("../lib/helpers/useAuth.js");
const usePermission_1 = require("../lib/helpers/usePermission.js");
const useMulter_1 = tslib_1.__importDefault(require("../lib/helpers/useMulter.js"));
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
//Get
router.get("/", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.getAllUsers));
router.get("/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("user-management:read"), (0, asyncHandler_1.asyncHandler)(user_controller_1.getUserById));
//Post
router.post("/", useAuth_1.withAuth, (0, usePermission_1.withPermission)("user-management:create"), (0, asyncHandler_1.asyncHandler)(user_controller_1.createUser));
//Patch
router.patch("/:id", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.updateUser));
router.patch("/:id/language", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userLanguage));
router.patch("/:id/avatar", useAuth_1.withAuth, useMulter_1.default.single("image_url"), (0, asyncHandler_1.asyncHandler)(user_controller_1.updateUserProfile));
router.put("/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("user-management:update"), (0, asyncHandler_1.asyncHandler)(user_controller_1.softDeleteUser));
exports.default = router;
