import { GetAllDeviceSession } from "../services/deviceSession.services.js";
export const getAllDeviceSesisonByUserId = async (request, response) => {
    try {
        const id = String(request.params.id);
        const { limit, after, orderBy, sortBy, search, before, user_id } = request.query;
        const result = await GetAllDeviceSession(id, {
            after: after,
            before: before,
            filter: {
                orderBy: orderBy,
                search: search,
                sortBy: sortBy,
            },
            limit: limit,
            user_id: user_id,
        });
        return response.status(200).json({
            ...result,
            timestamp: new Date(Date.now()),
            success: true,
        });
    }
    catch (error) {
        return response.status(500).json({
            message: "Internal Server Error",
            success: false,
            timestamp: new Date(Date.now()),
        });
    }
};
