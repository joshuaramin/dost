"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceSchema = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.ServiceSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Service Name is required"),
    description: zod_1.default.string().optional(),
});
