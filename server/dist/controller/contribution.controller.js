"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteContribution = exports.updateContribution = exports.createContribution = exports.getContributionById = exports.getAllContributions = void 0;
const tslib_1 = require("tslib");
const contribution_validation_1 = require("../lib/validation/contribution.validation.js");
const contribution_services_1 = require("../services/contribution.services.js");
const zod_1 = tslib_1.__importDefault(require("zod"));
const getAllContributions = async (request, response) => {
    const { after, before, search, sortBy, limit, classification, method, status, orderBy, type, sentiment, user_id, language, } = request.query;
    const result = await (0, contribution_services_1.GetAllContributions)({
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
exports.getAllContributions = getAllContributions;
const getContributionById = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, contribution_services_1.GetContributionById)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getContributionById = getContributionById;
const createContribution = async (request, response) => {
    const file = request.file;
    const parsedData = await contribution_validation_1.CreateContributionSchema.safeParse({
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
            schema: zod_1.default.flattenError(parsedData.error),
            timestamp: new Date(),
        });
    }
    const result = await (0, contribution_services_1.CreateContribution)(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(),
        success: true,
    });
};
exports.createContribution = createContribution;
const updateContribution = async (request, response) => {
    console.log(request.body);
    const parsedData = contribution_validation_1.UpdateContributionSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: zod_1.default.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = (0, contribution_services_1.UpdateContributeById)(parsedData.data);
    return response.status(200).json({
        ...result,
        success: true,
        timestamp: new Date(),
    });
};
exports.updateContribution = updateContribution;
const softDeleteContribution = async (request, response) => {
    const result = await (0, contribution_services_1.SoftDeleteContribution)(String(request.params.id));
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.softDeleteContribution = softDeleteContribution;
