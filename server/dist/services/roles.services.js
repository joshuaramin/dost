"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRolePermission = exports.SoftDeleteRole = exports.UpdateRoles = exports.CreateRole = exports.GetRoleBySlug = exports.GetAllRoles = void 0;
const tslib_1 = require("tslib");
const useCrud_1 = require("../lib/helpers/useCrud.js");
const useSlugify_1 = tslib_1.__importDefault(require("../lib/helpers/useSlugify.js"));
const prisma_1 = require("../lib/prisma/system/prisma.js");
// Manage
const RoleManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.role, "role_id");
// Functions
const GetAllRoles = ({ limit, filter: { orderBy, search, sortBy }, after, before, }) => {
    let where = {
        is_deleted: false,
        ...(search && {
            name: { contains: search, mode: "insensitive" },
        }),
    };
    return RoleManage.read({
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
        select: {
            role_id: true,
            name: true,
            slug: true,
            description: true,
            created_at: true,
            rolePermissions: {
                select: {
                    role_id: true,
                    permission_id: true,
                    Permission: {
                        select: { name: true },
                    },
                },
            },
        },
    });
};
exports.GetAllRoles = GetAllRoles;
const GetRoleBySlug = async (data) => {
    return RoleManage.readById(data, "slug", {
        select: {
            name: true,
            description: true,
            rolePermissions: true,
        },
    });
};
exports.GetRoleBySlug = GetRoleBySlug;
const CreateRole = async (data) => {
    return RoleManage.create({
        name: data.name,
        slug: (0, useSlugify_1.default)(data.name),
        description: data.description,
    });
};
exports.CreateRole = CreateRole;
const UpdateRoles = async (id, data) => {
    return RoleManage.update("slug", id, {
        name: data.name,
        description: data.description,
    });
};
exports.UpdateRoles = UpdateRoles;
const SoftDeleteRole = async (data) => {
    console.log("DATA: ", data);
    return RoleManage.delete("slug", data);
};
exports.SoftDeleteRole = SoftDeleteRole;
const AddRolePermission = async (role_id, data) => {
    console.log("Role ID: ", role_id);
    console.log("Body: ", data);
    const existing = await prisma_1.prisma.permission.findMany({
        where: { permission_id: { in: data.permissions } },
        select: { permission_id: true },
    });
    console.log("FOUND:", existing.length);
    console.log("EXPECTED:", data.permissions.length);
    return RoleManage.update("slug", role_id, {
        rolePermissions: {
            deleteMany: {},
            createMany: {
                data: existing.map((p) => ({
                    permission_id: p.permission_id,
                })),
                skipDuplicates: true,
            },
        },
    });
};
exports.AddRolePermission = AddRolePermission;
