"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.hashOTP = hashOTP;
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function hashOTP(code) {
    return crypto_1.default
        .createHmac("sha256", process.env.OTP_SECRET)
        .update(code)
        .digest("hex");
}
