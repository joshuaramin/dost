"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubResources = exports.SoftDeleteResource = exports.CreateResource = exports.UpdateResourceById = exports.GetResourceBySlug = exports.GetAllResource = void 0;
const tslib_1 = require("tslib");
const useSlugify_1 = tslib_1.__importDefault(require("../lib/helpers/useSlugify.js"));
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
const defaultActions = ["create", "read", "update", "delete", "deny", "export"];
// Manage
const ResourceManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.resource, "resource_id");
// Functions
const GetAllResource = ({ limit, after, before, filter: { orderBy, search, sortBy }, }) => {
    let where = {
        is_deleted: false,
        parent_id: null,
        ...(search && {
            name: { contains: search, mode: "insensitive" },
        }),
    };
    return ResourceManage.read({
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
            resource_id: true,
            name: true,
            slug: true,
            children: {
                where: { is_deleted: false },
                orderBy: {
                    order: "asc",
                },
                select: {
                    resource_id: true,
                    name: true,
                    slug: true,
                    permissions: {
                        select: {
                            permission_id: true,
                            name: true,
                        },
                    },
                },
            },
            created_at: true,
            updated_at: true,
        },
    });
};
exports.GetAllResource = GetAllResource;
const GetResourceBySlug = (data) => {
    return ResourceManage.readById(data, "slug", {
        include: { children: true },
    });
};
exports.GetResourceBySlug = GetResourceBySlug;
const UpdateResourceById = async (id, data) => {
    return ResourceManage.update("resource_id", id, data);
};
exports.UpdateResourceById = UpdateResourceById;
const CreateResource = async (data) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        return await Promise.all(data.map(async (resource, resourceIndex) => {
            const slug = (0, useSlugify_1.default)(resource.name);
            return await tx.resource.create({
                data: {
                    name: resource.name,
                    slug,
                    order: resource.order ?? resourceIndex + 1,
                    permissions: {
                        createMany: {
                            data: defaultActions.map((permission) => ({
                                name: `${slug}:${permission}`,
                                slug: (0, useSlugify_1.default)(permission),
                            })),
                        },
                    },
                    children: resource.children?.length
                        ? {
                            create: resource.children.map((child, index) => {
                                const childSlug = (0, useSlugify_1.default)(child.name);
                                return {
                                    name: child.name,
                                    order: index + 1,
                                    slug: childSlug,
                                    permissions: {
                                        createMany: {
                                            data: defaultActions.map((permission) => ({
                                                name: `${childSlug}:${permission}`,
                                                slug: (0, useSlugify_1.default)(permission),
                                            })),
                                        },
                                    },
                                };
                            }),
                        }
                        : undefined,
                },
            });
        }));
    });
};
exports.CreateResource = CreateResource;
const SoftDeleteResource = async (data) => {
    return ResourceManage.delete("resource_id", data);
};
exports.SoftDeleteResource = SoftDeleteResource;
const AddSubResources = async (id, data) => {
    const resource = await ResourceManage.readById(id, "slug");
    console.log("Resource to add sub-resource to:", data);
    return ResourceManage.update("slug", id, {
        children: {
            create: {
                name: data.data.name,
                order: data.data.order,
                slug: (0, useSlugify_1.default)(data.data.name),
                permissions: {
                    createMany: {
                        data: defaultActions.map((permission) => ({
                            name: `${(0, useSlugify_1.default)(data.data.name)}:${permission}`,
                            slug: (0, useSlugify_1.default)(permission),
                        })),
                    },
                },
            },
        },
    });
};
exports.AddSubResources = AddSubResources;
