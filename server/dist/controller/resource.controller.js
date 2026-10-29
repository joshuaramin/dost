import { AddSubResources, CreateResource, GetAllResource, GetResourceBySlug, SoftDeleteResource, UpdateResourceById, } from "../services/resource.services.js";
import { AddSubResourceSchema, ResourceSchema, } from "../lib/validation/resource.validation.js";
export const getAllResource = async (request, response) => {
    const { limit, after, orderBy, sortBy, search, before } = request.query;
    const result = await GetAllResource({
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
export const getResourceById = async (request, response) => {
    const id = String(request.params.id);
    const result = await GetResourceBySlug(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createResource = async (request, response) => {
    const parsedData = ResourceSchema.safeParse(request.body.resource);
    if (!parsedData.success) {
        return response.status(400).json({
            message: parsedData.error.flatten(),
            success: false,
            timestamp: new Date(),
        });
    }
    const result = await CreateResource(parsedData.data);
    return response.status(201).json({
        data: result,
        success: true,
        timestamp: new Date(),
    });
};
export const updateResource = async (request, response) => {
    const id = String(request.params.id);
    const parsedData = ResourceSchema.safeParse(request.body);
    const result = await UpdateResourceById(id, parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const softDeleteResource = async (request, response) => {
    const id = String(request.params.id);
    // console.log("soft delete resource controller", request.params.id);
    console.log("soft delete resource controller", id);
    const result = await SoftDeleteResource(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const addSubResource = async (request, response) => {
    const id = String(request.params.id);
    const body = await AddSubResourceSchema.safeParse(request.body);
    const result = AddSubResources(id, body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
