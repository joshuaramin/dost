"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const roles_controller_1 = require("../controller/roles.controller.js");
const asyncHandler_1 = require("../lib/common/middleware.ts/asyncHandler.js");
const useAuth_1 = require("../lib/helpers/useAuth.js");
const usePermission_1 = require("../lib/helpers/usePermission.js");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
//Get
router.get("/", (0, asyncHandler_1.asyncHandler)(roles_controller_1.getAllRoles));
router.get("/:slug", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(roles_controller_1.getRoleBySlug));
//Post
router.post("/", useAuth_1.withAuth, (0, usePermission_1.withPermission)("roles-and-permissions:create"), (0, asyncHandler_1.asyncHandler)(roles_controller_1.createRoles));
//Patch
router.patch("/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("roles-and-permissions:update"), (0, asyncHandler_1.asyncHandler)(roles_controller_1.softDeleteRoles));
router.put("/:id", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(roles_controller_1.updateRoles));
//Put
router.put("/addRolePermission/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("roles-and-permissions:update"), (0, asyncHandler_1.asyncHandler)(roles_controller_1.addRolePermission));
exports.default = router;
