import { CreateContributionSchema, UpdateContributionSchema, } from "../lib/validation/contribution.validation.js";
import { GetAllContributions, GetContributionById, CreateContribution, SoftDeleteContribution, UpdateContributeById, } from "../services/contribution.services.js";
import z from "zod";
export const getAllContributions = async (request, response) => {
    const { after, before, search, sortBy, limit, classification, method, status, orderBy, type, sentiment, user_id, language, } = request.query;
    const result = await GetAllContributions({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        classification: classification,
        language: language,
        method: method,
        status: status,
        type: type,
        limit: limit,
        sentiment: sentiment,
        user_id: user_id,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const getContributionById = async (request, response) => {
    const id = String(request.params.id);
    const result = await GetContributionById(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createContribution = async (request, response) => {
    const file = request.file;
    const parsedData = await CreateContributionSchema.safeParse({
        ...request.body,
        ...(file?.key
            ? {
                image_url: `https://ajxuatqnkjknuqeszdzz.supabase.co/storage/v1/object/public/advocaid/${file.key}`,
            }
            : {}),
    });
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: z.flattenError(parsedData.error),
            timestamp: new Date(),
        });
    }
    const result = await CreateContribution(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(),
        success: true,
    });
};
export const updateContribution = async (request, response) => {
    console.log(request.body);
    const parsedData = UpdateContributionSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = UpdateContributeById(parsedData.data);
    return response.status(200).json({
        ...result,
        success: true,
        timestamp: new Date(),
    });
};
export const softDeleteContribution = async (request, response) => {
    const result = await SoftDeleteContribution(String(request.params.id));
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
