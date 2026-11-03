import { CreateTreatmentHubService, GetAllTreatmentHubService, } from "../services/services.services.js";
export const getAllTreatmentHubService = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await GetAllTreatmentHubService({
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
export const createTreatmentHubService = async (request, response) => {
    const body = request.body;
    const result = await CreateTreatmentHubService(body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
