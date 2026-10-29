"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftDeleteOrganization = exports.UpdateOrganization = exports.CreateOrganization = exports.GetAllOrganization = void 0;
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
// Manage
const OrganizationManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.organization, "organization_id");
// Functions
const GetAllOrganization = ({ after, before, filter: { orderBy, search, sortBy }, limit, }) => {
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
exports.GetAllOrganization = GetAllOrganization;
const CreateOrganization = (data) => {
    return OrganizationManage.create({
        logo: data.logo,
        name: data.name,
        contact: data.contact,
        address: data.address,
    });
};
exports.CreateOrganization = CreateOrganization;
const UpdateOrganization = (id, data) => {
    return OrganizationManage.update("organization_id", id, {
        address: data.address,
        contact: data.contact,
        name: data.name,
        logo: data.logo,
    });
};
exports.UpdateOrganization = UpdateOrganization;
const SoftDeleteOrganization = (data) => {
    return OrganizationManage.delete("organization_id", data);
};
exports.SoftDeleteOrganization = SoftDeleteOrganization;
