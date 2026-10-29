"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const organization_controller_1 = require("../controller/organization.controller.js");
const asyncHandler_1 = require("../lib/common/middleware.ts/asyncHandler.js");
const useAuth_1 = require("../lib/helpers/useAuth.js");
const useMulter_1 = tslib_1.__importDefault(require("../lib/helpers/useMulter.js"));
const usePermission_1 = require("../lib/helpers/usePermission.js");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
//Get
router.get("/", organization_controller_1.getAllOrganization);
//Post
router.post("/", useAuth_1.withAuth, (0, usePermission_1.withPermission)("organization-management:create"), useMulter_1.default.single("logo"), organization_controller_1.createOrganization);
//Put
router.patch("/:id", useAuth_1.withAuth, (0, asyncHandler_1.asyncHandler)(organization_controller_1.softDeleteOrganization));
//Patch
router.put("/:id", useAuth_1.withAuth, (0, usePermission_1.withPermission)("organization-management:update"), organization_controller_1.updateOrganizatoin);
exports.default = router;
