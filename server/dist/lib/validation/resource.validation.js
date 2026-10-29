"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubResourceSchema = exports.ResourceSchema = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.ResourceSchema = zod_1.default.array(zod_1.default.object({
    name: zod_1.default.string().trim().min(1),
    order: zod_1.default.number().positive().optional(),
    children: zod_1.default
        .array(zod_1.default.object({
        name: zod_1.default.string().trim().min(1),
    }))
        .optional(),
}));
exports.AddSubResourceSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Sub Resource name is required"),
    order: zod_1.default.number().positive(),
});
