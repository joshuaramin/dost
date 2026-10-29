"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivityLgos = exports.getAllActivityLogs = void 0;
const activity_log_validation_1 = require("../lib/validation/activity-log.validation.js");
const log_services_1 = require("../services/log.services.js");
const zod_1 = require("zod");
const getAllActivityLogs = async (request, response) => {
    const { limit, sortBy, orderBy, search, after, before } = request.query;
    const id = String(request.params.id);
    const result = await (0, log_services_1.GetAllActivityLogs)(id, {
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
exports.getAllActivityLogs = getAllActivityLogs;
const createActivityLgos = async (request, response) => {
    const body = request.body;
    const parsedData = activity_log_validation_1.CreateActivityLog.safeParse(body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: zod_1.z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await (0, log_services_1.CreateActivityLogs)(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createActivityLgos = createActivityLgos;
