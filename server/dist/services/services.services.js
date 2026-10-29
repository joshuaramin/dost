"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTreatmentHubService = exports.GetAllTreatmentHubService = void 0;
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/geospatial/prisma.js");
const ServiceManage = new useCrud_1.PrismaCRUDManager(prisma_1.geodb.services, "service_id", false);
const GetAllTreatmentHubService = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
    const where = {
        ...(search && {
            name: {
                contains: search,
                mode: "insensitive",
            },
        }),
    };
    return ServiceManage.read({
        where,
        limit,
        ...(after && {
            cursor: after,
            direction: "forward",
        }),
        ...(before && {
            cursor: after,
            direction: "backward",
        }),
        orderBy: {
            [orderBy]: sortBy,
        },
        select: {
            service_id: true,
            name: true,
        },
    });
};
exports.GetAllTreatmentHubService = GetAllTreatmentHubService;
const CreateTreatmentHubService = (data) => {
    return ServiceManage.create({
        name: data.name,
        description: data.description,
    });
};
exports.CreateTreatmentHubService = CreateTreatmentHubService;
