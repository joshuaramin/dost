import { CreateOrganization, GetAllOrganization, SoftDeleteOrganization, UpdateOrganization, } from "../services/organization.services.js";
import { OrganizationSchema, OrganizationUpdateSchema, } from "../lib/validation/organization.validation.js";
export const getAllOrganization = async (request, response) => {
    const { sortBy, orderBy, limit, search, after, before } = request.query;
    const result = await GetAllOrganization({
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
export const createOrganization = async (request, response) => {
    try {
        const parseData = OrganizationSchema.safeParse(request.body);
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
        const result = await CreateOrganization({
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
export const updateOrganizatoin = async (request, response) => {
    try {
        const id = String(request.params.id);
        const body = request.body;
        const parseData = OrganizationUpdateSchema.safeParse(body);
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
        const result = await UpdateOrganization(id, {
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
export const softDeleteOrganization = async (request, response) => {
    const id = String(request.params.id);
    const result = await SoftDeleteOrganization(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
