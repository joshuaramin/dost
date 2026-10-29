"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionValidation = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.ActionValidation = zod_1.default.object({
    name: zod_1.default.string().min(1, "Action name is required"),
});
