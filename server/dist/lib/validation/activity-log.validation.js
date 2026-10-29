"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivityLog = exports.ActivityLogsSchema = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.ActivityLogsSchema = zod_1.default.object({
    type: zod_1.default.string().min(1, "Type is requireds"),
    description: zod_1.default.string().min(1, "Description is required"),
    user_id: zod_1.default.string().min(1, "User ID is required"),
});
exports.CreateActivityLog = exports.ActivityLogsSchema;
