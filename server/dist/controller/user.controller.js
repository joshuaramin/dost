import { CreateUserSchema, UpdateSchema, UserSchema, } from "../lib/validation/user.validation.js";
import { CreateUser, GetAllUsers, GetUserById, SoftDeleteUser, UpdateUser, UpdateUserAvatar, UpdateUserLanguage, } from "../services/user.services.js";
import z from "zod";
export const getAllUsers = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, organization_id, role_id, before, } = request.query;
    const result = await GetAllUsers({
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
export const getUserById = async (request, response) => {
    const id = String(request.params.id);
    const result = await GetUserById(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createUser = async (request, response) => {
    const parsedData = await CreateUserSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await CreateUser(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const updateUser = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = UpdateSchema.safeParse(request.body);
    const result = await UpdateUser(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const userLanguage = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = UserSchema.safeParse(request.body);
    const result = await UpdateUserLanguage(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const updateUserProfile = async (request, response) => {
    const id = String(request.params.id);
    // const parsedData = UpdateSchema.safeParse(request.body);
    const file = request.file;
    if (!file) {
        return { message: "No file uploaded" };
    }
    const result = await UpdateUserAvatar(id, `https://ajxuatqnkjknuqeszdzz.supabase.co/storage/v1/object/public/advocaid/${file.key}`);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const softDeleteUser = async (request, response) => {
    const result = await SoftDeleteUser(request.params.id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
