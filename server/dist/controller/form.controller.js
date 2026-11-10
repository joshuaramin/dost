import { FormSchema } from "../lib/validation/form.validation.js";
import { CreateForm, GetAllForm, GetFormById, } from "../services/form.services.js";
import { z } from "zod";
export const getAllForms = async (request, response) => {
    const { limit, after, orderBy, sortBy, search, before, type } = request.query;
    const result = await GetAllForm({
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
export const getFormById = async (request, response) => {
    const id = String(request.params.id);
    const result = await GetFormById(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createForm = async (request, response) => {
    const parsedData = FormSchema.safeParse(request.body);
    const file = request.file;
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await CreateForm({
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
