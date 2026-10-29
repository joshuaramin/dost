"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slugify_1 = tslib_1.__importDefault(require("slugify"));
const useSlugify = (text) => {
    return (0, slugify_1.default)(text, {
        lower: true,
        trim: true,
        strict: true,
    });
};
exports.default = useSlugify;
