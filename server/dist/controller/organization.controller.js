"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteOrganization = exports.updateOrganizatoin = exports.createOrganization = exports.getAllOrganization = void 0;
const organization_services_1 = require("../services/organization.services.js");
const organization_validation_1 = require("../lib/validation/organization.validation.js");
const getAllOrganization = async (request, response) => {
    const { sortBy, orderBy, limit, search, after, before } = request.query;
    const result = await (0, organization_services_1.GetAllOrganization)({
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
exports.getAllOrganization = getAllOrganization;
const createOrganization = async (request, response) => {
    try {
        const parseData = organization_validation_1.OrganizationSchema.safeParse(request.body);
        if (!parseData.success) {
            return response.status(400).json({
                message: "Invalid Schema",
                schema: parseData.error.flatten().fieldErrors,
                timestamp: new Date(),
            });
        }
        const file = request.file;
        console.log(file);
        if (!file) {
            return response.status(400).json({
                message: "No logo file uploaded",
            });
        }
        if (!file.mimetype.startsWith("image/")) {
            return response.status(400).json({
                message: "Only image files are allowed",
            });
        }
        const result = await (0, organization_services_1.CreateOrganization)({
            logo: `https://ajxuatqnkjknuqeszdzz.supabase.co/storage/v1/object/public/advocaid/${file.key}`,
            name: parseData.data.name,
            address: parseData.data.address,
            contact: parseData.data.contact,
        });
        return response.status(200).json({
            ...result,
            success: true,
            timestamp: new Date(),
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Something went wrong",
            timestamp: new Date(),
        });
    }
};
exports.createOrganization = createOrganization;
const updateOrganizatoin = async (request, response) => {
    try {
        const id = String(request.params.id);
        const body = request.body;
        const parseData = organization_validation_1.OrganizationUpdateSchema.safeParse(body);
        if (!parseData.success) {
            return response.status(400).json({
                message: "Invalid Schema",
                schema: parseData.error.flatten().fieldErrors,
                timestamp: new Date(),
            });
        }
        const file = request.file;
        if (!file) {
            return response.status(400).json({
                message: "No logo file uploaded",
            });
        }
        if (!file.mimetype.startsWith("image/")) {
            return response.status(400).json({
                message: "Only image files are allowed",
            });
        }
        const result = await (0, organization_services_1.UpdateOrganization)(id, {
            logo: `${process.env.CDN_URL}/${file.key}`,
            name: parseData.data.name,
            address: parseData.data.address,
            contact: parseData.data.contact,
        });
        return response.status(200).json({
            ...result,
            success: true,
            timestamp: new Date(),
        });
    }
    catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            timestamp: new Date(),
        });
    }
};
exports.updateOrganizatoin = updateOrganizatoin;
const softDeleteOrganization = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, organization_services_1.SoftDeleteOrganization)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.softDeleteOrganization = softDeleteOrganization;
