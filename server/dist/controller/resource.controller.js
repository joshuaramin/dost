"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubResource = exports.softDeleteResource = exports.updateResource = exports.createResource = exports.getResourceById = exports.getAllResource = void 0;
const resource_services_1 = require("../services/resource.services.js");
const resource_validation_1 = require("../lib/validation/resource.validation.js");
const getAllResource = async (request, response) => {
    const { limit, after, orderBy, sortBy, search, before } = request.query;
    const result = await (0, resource_services_1.GetAllResource)({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        limit: limit,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getAllResource = getAllResource;
const getResourceById = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, resource_services_1.GetResourceBySlug)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getResourceById = getResourceById;
const createResource = async (request, response) => {
    const parsedData = resource_validation_1.ResourceSchema.safeParse(request.body.resource);
    if (!parsedData.success) {
        return response.status(400).json({
            message: parsedData.error.flatten(),
            success: false,
            timestamp: new Date(),
        });
    }
    const result = await (0, resource_services_1.CreateResource)(parsedData.data);
    return response.status(201).json({
        data: result,
        success: true,
        timestamp: new Date(),
    });
};
exports.createResource = createResource;
const updateResource = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = resource_validation_1.ResourceSchema.safeParse(request.body);
    const result = await (0, resource_services_1.UpdateResourceById)(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.updateResource = updateResource;
const softDeleteResource = async (request, response) => {
    const id = String(request.params.id);
    // console.log("soft delete resource controller", request.params.id);
    console.log("soft delete resource controller", id);
    const result = await (0, resource_services_1.SoftDeleteResource)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.softDeleteResource = softDeleteResource;
const addSubResource = async (request, response) => {
    const id = String(request.params.id);
    const body = await resource_validation_1.AddSubResourceSchema.safeParse(request.body);
    const result = (0, resource_services_1.AddSubResources)(id, body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.addSubResource = addSubResource;
