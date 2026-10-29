"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUpdateSchema = exports.OrganizationSchema = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.OrganizationSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Organizatoin name is required"),
    address: zod_1.default.string().min(1, "Address is required"),
    contact: zod_1.default.string().min(1, "Contact Number is required"),
});
exports.OrganizationUpdateSchema = exports.OrganizationSchema;
