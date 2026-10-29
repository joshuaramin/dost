"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDeviceSesisonByUserId = void 0;
const deviceSession_services_1 = require("../services/deviceSession.services.js");
const getAllDeviceSesisonByUserId = async (request, response) => {
    try {
        const id = String(request.params.id);
        const { limit, after, orderBy, sortBy, search, before, user_id } = request.query;
        const result = await (0, deviceSession_services_1.GetAllDeviceSession)(id, {
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
exports.getAllDeviceSesisonByUserId = getAllDeviceSesisonByUserId;
