import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { geodb } from "../lib/prisma/geospatial/prisma.js";
const ServiceManage = new PrismaCRUDManager(geodb.services, "service_id", false);
export const GetAllTreatmentHubService = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
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
export const CreateTreatmentHubService = (data) => {
    return ServiceManage.create({
        name: data.name,
        description: data.description,
    });
};
