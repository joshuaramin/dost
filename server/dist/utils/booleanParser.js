"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanField = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
exports.booleanField = zod_1.default.preprocess((value) => {
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    return value;
}, zod_1.default.boolean());
