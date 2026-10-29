"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRolePermission = exports.softDeleteRoles = exports.updateRoles = exports.createRoles = exports.getRoleBySlug = exports.getAllRoles = void 0;
const Role_validation_1 = require("../lib/validation/Role.validation.js");
const roles_services_1 = require("../services/roles.services.js");
const getAllRoles = async (request, response) => {
    const { sortBy, orderBy, limit, search, after, before } = request.query;
    const result = await (0, roles_services_1.GetAllRoles)({
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
exports.getAllRoles = getAllRoles;
const getRoleBySlug = async (request, response) => {
    const slug = request.params.slug;
    console.log(slug);
    const result = await (0, roles_services_1.GetRoleBySlug)(slug);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getRoleBySlug = getRoleBySlug;
const createRoles = async (request, response) => {
    const parsedData = Role_validation_1.RoleSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: parsedData.error.flatten().fieldErrors,
            timestamp: new Date(Date.now()),
        });
    }
    const result = await (0, roles_services_1.CreateRole)(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createRoles = createRoles;
const updateRoles = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = Role_validation_1.UpdaetRoleSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: parsedData.error.flatten().fieldErrors,
            timestamp: new Date(),
        });
    }
    const result = await (0, roles_services_1.UpdateRoles)(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(),
        success: true,
    });
};
exports.updateRoles = updateRoles;
const softDeleteRoles = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, roles_services_1.SoftDeleteRole)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.softDeleteRoles = softDeleteRoles;
const addRolePermission = async (request, response) => {
    const id = String(request.params.id);
    const body = request.body;
    console.log("ID", id);
    console.log("Body", body);
    const result = await (0, roles_services_1.AddRolePermission)(id, body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.addRolePermission = addRolePermission;
