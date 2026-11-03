import { RegisterUserSchema, } from "../lib/validation/user.validation.js";
import { AuthLogin, AuthLogout, AuthRegister, AuthVerfiy, AuthVerified, GetDeviceSessions, GetResendOTP, } from "..//services/auth.services.js";
import { getDeviceInfo } from "../utils/deviceParser.js";
export const Login = async (request, response) => {
    const deviceInfo = getDeviceInfo(request);
    const result = await AuthLogin(request.body, deviceInfo);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const VerifyOTP = async (request, response) => {
    const deviceInfo = getDeviceInfo(request);
    const email = String(request.query.email);
    const result = await AuthVerfiy(email, request.body, deviceInfo);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export async function Logout(request, response) {
    const userId = String(request.params.id);
    const result = await AuthLogout(userId);
    return response
        .status(200)
        .json({ data: result, message: "Logged out successfully" });
}
export const DeviceSessions = async (request, response) => {
    const userId = String(request.params.id);
    const { orderBy, sortBy, after, before, limit, search } = request.query;
    const result = await GetDeviceSessions({
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
export const ResendOTP = async (request, response) => {
    const deviceInfo = getDeviceInfo(request);
    const email = String(request.query.email);
    const result = await GetResendOTP(email, deviceInfo);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const Registration = async (request, response) => {
    const body = request.body;
    const parsedData = RegisterUserSchema.safeParse(body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: parsedData.error.flatten(),
            success: false,
            timestamp: new Date(),
        });
    }
    const result = await AuthRegister(parsedData.data);
    return response.status(200).json({
        ...result,
        success: true,
        timestamp: new Date(),
    });
};
export const Verified = async (request, response) => {
    const token = String(request.query.token);
    if (!token) {
        return response.status(400).json({
            success: false,
            message: "Verification token is required.",
            timestamp: new Date(),
        });
    }
    try {
        const result = await AuthVerified(token);
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
