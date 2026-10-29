"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdaetRoleSchema = exports.RoleSchema = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.RoleSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Role name is required"),
    description: zod_1.default.string().min(1, "Role Description is required"),
});
exports.UpdaetRoleSchema = exports.RoleSchema;
