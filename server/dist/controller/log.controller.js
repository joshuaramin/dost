import { CreateActivityLog } from "../lib/validation/activity-log.validation.js";
import { CreateActivityLogs, GetAllActivityLogs, } from "../services/log.services.js";
import { z } from "zod";
export const getAllActivityLogs = async (request, response) => {
    const { limit, sortBy, orderBy, search, after, before } = request.query;
    const id = String(request.params.id);
    const result = await GetAllActivityLogs(id, {
        after: after,
        limit: limit,
        before: before,
        filter: {
            orderBy: orderBy,
            sortBy: sortBy,
            search: search,
        },
    });
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
export const createActivityLgos = async (request, response) => {
    const body = request.body;
    const parsedData = CreateActivityLog.safeParse(body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await CreateActivityLogs(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
