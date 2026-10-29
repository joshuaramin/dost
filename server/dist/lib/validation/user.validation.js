"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserSchema = exports.UpdateSchema = exports.CreateUserSchema = exports.ProfileSchema = exports.UserSchema = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.UserSchema = zod_1.default.object({
    email: zod_1.default.string().min(1, "Email address is required"),
});
exports.ProfileSchema = zod_1.default.object({
    first_name: zod_1.default.string().min(1, "First Name is required"),
    last_name: zod_1.default.string().min(1, "Last Name is required"),
});
exports.CreateUserSchema = exports.UserSchema.extend({
    ...exports.ProfileSchema.shape,
    role_id: zod_1.default.string().min(1, "Role ID is required"),
    organization_id: zod_1.default.string().optional(),
});
exports.UpdateSchema = zod_1.default
    .object({
    email: zod_1.default.string(),
    first_name: zod_1.default.string().min(1, "First Name is required"),
    last_name: zod_1.default.string().min(1, "Last Name is required"),
    location: zod_1.default.string().min(1, "Location is required"),
})
    .partial();
exports.RegisterUserSchema = exports.UserSchema.extend({
    first_name: zod_1.default.string().min(1, "First name is required"),
    last_name: zod_1.default.string().min(1, "Last name is required"),
    role_id: zod_1.default.string().min(1, "Role is required"),
    organization_id: zod_1.default.string().optional(),
});
