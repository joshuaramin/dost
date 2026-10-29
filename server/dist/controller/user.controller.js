"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteUser = exports.updateUserProfile = exports.userLanguage = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const tslib_1 = require("tslib");
const user_validation_1 = require("../lib/validation/user.validation.js");
const user_services_1 = require("../services/user.services.js");
const zod_1 = tslib_1.__importDefault(require("zod"));
const getAllUsers = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, organization_id, role_id, before, } = request.query;
    const result = await (0, user_services_1.GetAllUsers)({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        role_id: role_id,
        organization_id: organization_id,
        limit: limit,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getAllUsers = getAllUsers;
const getUserById = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, user_services_1.GetUserById)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getUserById = getUserById;
const createUser = async (request, response) => {
    const parsedData = await user_validation_1.CreateUserSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: zod_1.default.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await (0, user_services_1.CreateUser)(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createUser = createUser;
const updateUser = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = user_validation_1.UpdateSchema.safeParse(request.body);
    const result = await (0, user_services_1.UpdateUser)(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.updateUser = updateUser;
const userLanguage = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = user_validation_1.UserSchema.safeParse(request.body);
    const result = await (0, user_services_1.UpdateUserLanguage)(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.userLanguage = userLanguage;
const updateUserProfile = async (request, response) => {
    const id = String(request.params.id);
    // const parsedData = UpdateSchema.safeParse(request.body);
    const file = request.file;
    if (!file) {
        return { message: "No file uploaded" };
    }
    const result = await (0, user_services_1.UpdateUserAvatar)(id, `https://ajxuatqnkjknuqeszdzz.supabase.co/storage/v1/object/public/advocaid/${file.key}`);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.updateUserProfile = updateUserProfile;
const softDeleteUser = async (request, response) => {
    const result = await (0, user_services_1.SoftDeleteUser)(request.params.id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.softDeleteUser = softDeleteUser;
