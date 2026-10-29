"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTreatmentHub = exports.getTreatmentHubById = exports.getAllTreatmentHub = void 0;
const treatment_hub_services_1 = require("../services/treatment-hub.services.js");
const treatment_hub_validation_1 = require("../lib/validation/treatment-hub.validation.js");
const zod_1 = require("zod");
const getAllTreatmentHub = async (request, response) => {
    const { after, orderBy, search, sortBy, limit, before, psgc_code, service_id, } = request.query;
    const result = await (0, treatment_hub_services_1.GetAllTreatmentHub)({
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
exports.getAllTreatmentHub = getAllTreatmentHub;
const getTreatmentHubById = (request, response) => {
    const id = String(request.params.slug);
    const result = (0, treatment_hub_services_1.GetTreatmentHubBySlug)(id);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.getTreatmentHubById = getTreatmentHubById;
const createTreatmentHub = async (request, response) => {
    const parsedData = await treatment_hub_validation_1.CreateTreatmentHubSchema.safeParse(request.body);
    if (!parsedData.success) {
        return response.status(400).json({
            message: "Invalid Schema",
            schema: zod_1.z.flattenError(parsedData.error),
            timestamp: new Date(Date.now()),
        });
    }
    const result = await (0, treatment_hub_services_1.CreateTreatmentHub)(parsedData.data);
    return response.status(200).json({
        ...result,
        timestamp: new Date(Date.now()),
        success: true,
    });
};
exports.createTreatmentHub = createTreatmentHub;
