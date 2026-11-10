import { RoleSchema, UpdaetRoleSchema, } from "../lib/validation/Role.validation.js";
import { AddRolePermission, CreateRole, GetAllRoles, GetRoleBySlug, SoftDeleteRole, UpdateRoles, } from "../services/roles.services.js";
export const getAllRoles = async (request, response) => {
    const { sortBy, orderBy, limit, search, after, before } = request.query;
    const result = await GetAllRoles({
        limit: limit,
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const getRoleBySlug = async (request, response) => {
    const slug = request.params.slug;
    console.log(slug);
    const result = await GetRoleBySlug(slug);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createRoles = async (request, response) => {
    const parsedData = RoleSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: parsedData.error.flatten().fieldErrors,
            timestamp: new Date(Date.now()),
        });
    }
    const result = await CreateRole(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const updateRoles = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = UpdaetRoleSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: parsedData.error.flatten().fieldErrors,
            timestamp: new Date(),
        });
    }
    const result = await UpdateRoles(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(),
        success: true,
    });
};
export const softDeleteRoles = async (request, response) => {
    const id = String(request.params.id);
    const result = await SoftDeleteRole(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const addRolePermission = async (request, response) => {
    const id = String(request.params.id);
    const body = request.body;
    console.log("ID", id);
    console.log("Body", body);
    const result = await AddRolePermission(id, body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
