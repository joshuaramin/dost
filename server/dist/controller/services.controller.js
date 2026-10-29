"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTreatmentHubService = exports.getAllTreatmentHubService = void 0;
const services_services_1 = require("../services/services.services.js");
const getAllTreatmentHubService = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before } = request.query;
    const result = await (0, services_services_1.GetAllTreatmentHubService)({
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
exports.getAllTreatmentHubService = getAllTreatmentHubService;
const createTreatmentHubService = async (request, response) => {
    const body = request.body;
    const result = await (0, services_services_1.CreateTreatmentHubService)(body);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createTreatmentHubService = createTreatmentHubService;
