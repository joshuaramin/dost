"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const resource_controller_1 = require("../controller/resource.controller.js");
const useAuth_1 = require("../lib/helpers/useAuth.js");
const usePermission_1 = require("../lib/helpers/usePermission.js");
const asyncHandler_1 = require("../lib/common/middleware.ts/asyncHandler.js");
const router = express_1.default.Router();
// Get
router.get("/", useAuth_1.withAuth, 
// withPermission("resource:read"),
(0, asyncHandler_1.asyncHandler)(resource_controller_1.getAllResource));
router.get("/:id", useAuth_1.withAuth, 
// withPermission("resource:read"),
(0, asyncHandler_1.asyncHandler)(resource_controller_1.getResourceById));
//Post
router.post("/", 
// withAuth,
// withPermission("resource:create"),
(0, asyncHandler_1.asyncHandler)(resource_controller_1.createResource));
//Patch
router.patch("/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("resource:update"), (0, asyncHandler_1.asyncHandler)(resource_controller_1.softDeleteResource));
router.patch("/addResource/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("resource:update"), (0, asyncHandler_1.asyncHandler)(resource_controller_1.addSubResource));
//Put
exports.default = router;
