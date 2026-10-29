"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const educational_resources_controller_1 = require("../controller/educational-resources.controller.js");
const useAuth_1 = require("../lib/helpers/useAuth.js");
const asyncHandler_1 = require("../lib/common/middleware.ts/asyncHandler.js");
const useMulter_1 = tslib_1.__importDefault(require("../lib/helpers/useMulter.js"));
const usePermission_1 = require("../lib/helpers/usePermission.js");
const router = express_1.default.Router();
//Get
router.get("/tag", (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.getEducationTag));
router.get("/category", (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.getAllEducationCategory));
router.get("/", (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.getAllEducationResources));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.getEducationById));
//Post
router.post("/", useAuth_1.withAuth, (0, usePermission_1.withPermission)("educational-resource:create"), useMulter_1.default.fields([{ name: "attachments" }]), (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.createEducationResources));
router.post("/tag", useAuth_1.withAuth, (0, usePermission_1.withPermission)("educational-resource:create"), (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.createEducationTag));
router.post("/category", useAuth_1.withAuth, (0, usePermission_1.withPermission)("educational-resource:create"), (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.createEducationCategory));
//Put
router.put("/:slug", useAuth_1.withAuth, (0, usePermission_1.withPermission)("educational-resource:update"), useMulter_1.default.fields([{ name: "attachments" }]), (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.updateEducationResource));
//Patch
router.patch("/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("educational-resources:update"), (0, asyncHandler_1.asyncHandler)(educational_resources_controller_1.softDeleteEducationResource));
exports.default = router;
