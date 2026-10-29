"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForm = exports.getFormById = exports.getAllForms = void 0;
const form_validation_1 = require("../lib/validation/form.validation.js");
const form_services_1 = require("../services/form.services.js");
const zod_1 = require("zod");
const getAllForms = async (request, response) => {
    const { limit, after, orderBy, sortBy, search, before, type } = request.query;
    const result = await (0, form_services_1.GetAllForm)({
        after: after,
        before: before,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        limit: limit,
        type: type,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getAllForms = getAllForms;
const getFormById = async (request, response) => {
    const id = String(request.params.id);
    const result = await (0, form_services_1.GetFormById)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getFormById = getFormById;
const createForm = async (request, response) => {
    const parsedData = form_validation_1.FormSchema.safeParse(request.body);
    const file = request.file;
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: zod_1.z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await (0, form_services_1.CreateForm)({
        ...parsedData.data,
        ...(file?.key
            ? {
                image_url: `https://ajxuatqnkjknuqeszdzz.supabase.co/storage/v1/object/public/advocaid/${file.key}`,
            }
            : {}),
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createForm = createForm;
