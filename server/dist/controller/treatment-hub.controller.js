import { CreateTreatmentHub, GetAllTreatmentHub, GetTreatmentHubBySlug, } from "../services/treatment-hub.services.js";
import { CreateTreatmentHubSchema } from "../lib/validation/treatment-hub.validation.js";
import { z } from "zod";
export const getAllTreatmentHub = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before, psgc_code, service_id, } = request.query;
    const result = await GetAllTreatmentHub({
        after: after,
        before: before,
        limit: limit,
        filter: {
            orderBy: orderBy,
            search: search,
            sortBy: sortBy,
        },
        psgc_code: psgc_code,
        service_id: service_id,
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const getTreatmentHubById = (request, response) => {
    const id = String(request.params.slug);
    const result = GetTreatmentHubBySlug(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createTreatmentHub = async (request, response) => {
    const parsedData = await CreateTreatmentHubSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await CreateTreatmentHub(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
