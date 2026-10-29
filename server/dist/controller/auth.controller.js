"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verified = exports.Registration = exports.ResendOTP = exports.DeviceSessions = exports.VerifyOTP = exports.Login = void 0;
exports.Logout = Logout;
const user_validation_1 = require("../lib/validation/user.validation.js");
const auth_services_1 = require("../services/auth.services.js");
const deviceParser_1 = require("../utils/deviceParser.js");
const Login = async (request, response) => {
    const deviceInfo = (0, deviceParser_1.getDeviceInfo)(request);
    const result = await (0, auth_services_1.AuthLogin)(request.body, deviceInfo);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.Login = Login;
const VerifyOTP = async (request, response) => {
    const deviceInfo = (0, deviceParser_1.getDeviceInfo)(request);
    const email = String(request.query.email);
    const result = await (0, auth_services_1.AuthVerfiy)(email, request.body, deviceInfo);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.VerifyOTP = VerifyOTP;
async function Logout(request, response) {
    const userId = String(request.params.id);
    const result = await (0, auth_services_1.AuthLogout)(userId);
    return response
        .status(200)
        .json({ data: result, message: "Logged out successfully" });
}
const DeviceSessions = async (request, response) => {
    const userId = String(request.params.id);
    const { orderBy, sortBy, after, before, limit, search } = request.query;
    const result = await (0, auth_services_1.GetDeviceSessions)({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        limit: limit,
        user_id: userId,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.DeviceSessions = DeviceSessions;
const ResendOTP = async (request, response) => {
    const deviceInfo = (0, deviceParser_1.getDeviceInfo)(request);
    const email = String(request.query.email);
    const result = await (0, auth_services_1.GetResendOTP)(email, deviceInfo);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.ResendOTP = ResendOTP;
const Registration = async (request, response) => {
    const body = request.body;
    const parsedData = user_validation_1.RegisterUserSchema.safeParse(body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: parsedData.error.flatten(),
            success: false,
            timestamp: new Date(),
        });
    }
    const result = await (0, auth_services_1.AuthRegister)(parsedData.data);
    return response.status(200).json({
        ...result,
        success: true,
        timestamp: new Date(),
    });
};
exports.Registration = Registration;
const Verified = async (request, response) => {
    const token = String(request.query.token);
    if (!token) {
        return response.status(400).json({
            success: false,
            message: "Verification token is required.",
            timestamp: new Date(),
        });
    }
    try {
        const result = await (0, auth_services_1.AuthVerified)(token);
        return response.status(200).json({
            ...result,
            success: true,
            timestamp: new Date(),
        });
    }
    catch (error) {
        return response.status(400).json({
            success: false,
            message: "Invalid or expired verification token.",
            timestamp: new Date(),
        });
    }
};
exports.Verified = Verified;
