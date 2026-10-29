"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSchema = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.FormSchema = zod_1.default.object({
    type: zod_1.default.string().min(1, "Type is required"),
    description: zod_1.default.string().min(1, "Description is required"),
    image_url: zod_1.default.string().optional(),
    user_id: zod_1.default.string().min(1, "User ID is required"),
});
