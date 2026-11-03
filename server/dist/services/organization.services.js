import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
// Manage
const OrganizationManage = new PrismaCRUDManager(prisma.organization, "organization_id");
// Functions
export const GetAllOrganization = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
    let where = {
        is_deleted: false,
        ...(search && {
            name: { contains: search, mode: "insensitive" },
        }),
    };
    return OrganizationManage.read({
        where,
        limit,
        ...(after && {
            cursor: after,
            direction: "forward",
        }),
        ...(before && {
            cursor: before,
            direction: "backward",
        }),
        orderBy: {
            [orderBy]: sortBy,
        },
    });
};
export const CreateOrganization = (data) => {
    return OrganizationManage.create({
        logo: data.logo,
        name: data.name,
        contact: data.contact,
        address: data.address,
    });
};
export const UpdateOrganization = (id, data) => {
    return OrganizationManage.update("organization_id", id, {
        address: data.address,
        contact: data.contact,
        name: data.name,
        logo: data.logo,
    });
};
export const SoftDeleteOrganization = (data) => {
    return OrganizationManage.delete("organization_id", data);
};
