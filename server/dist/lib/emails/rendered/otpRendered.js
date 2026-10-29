"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderOTPTemplate = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const render_1 = require("@react-email/render");
const advocaid_otp_1 = tslib_1.__importDefault(require("../templates/advocaid-otp"));
const renderOTPTemplate = (fullname, code) => {
    return (0, render_1.render)((0, jsx_runtime_1.jsx)(advocaid_otp_1.default, { fullname: fullname, code: code }));
};
exports.renderOTPTemplate = renderOTPTemplate;
