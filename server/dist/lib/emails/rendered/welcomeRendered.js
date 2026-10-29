"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWelcome = void 0;
const tslib_1 = require("tslib");
const render_1 = require("@react-email/render");
const welcome_1 = tslib_1.__importDefault(require("../templates/welcome"));
const renderWelcome = async (fullname, activationUrl) => {
    return await (0, render_1.render)((0, welcome_1.default)({
        fullname,
        activationUrl,
    }));
};
exports.renderWelcome = renderWelcome;
