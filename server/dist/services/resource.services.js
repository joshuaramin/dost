import useSlugify from "../lib/helpers/useSlugify.js";
import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
const defaultActions = ["create", "read", "update", "delete", "deny", "export"];
// Manage
const ResourceManage = new PrismaCRUDManager(prisma.resource, "resource_id");
// Functions
export const GetAllResource = ({ limit, after, before, filter: { orderBy, search, sortBy }, }) => {
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
export const GetResourceBySlug = (data) => {
    return ResourceManage.readById(data, "slug", {
        include: { children: true },
    });
};
export const UpdateResourceById = async (id, data) => {
    return ResourceManage.update("resource_id", id, data);
};
export const CreateResource = async (data) => {
    return await prisma.$transaction(async (tx) => {
        return await Promise.all(data.map(async (resource, resourceIndex) => {
            const slug = useSlugify(resource.name);
            return await tx.resource.create({
                data: {
                    name: resource.name,
                    slug,
                    order: resource.order ?? resourceIndex + 1,
                    permissions: {
                        createMany: {
                            data: defaultActions.map((permission) => ({
                                name: `${slug}:${permission}`,
                                slug: useSlugify(permission),
                            })),
                        },
                    },
                    children: resource.children?.length
                        ? {
                            create: resource.children.map((child, index) => {
                                const childSlug = useSlugify(child.name);
                                return {
                                    name: child.name,
                                    order: index + 1,
                                    slug: childSlug,
                                    permissions: {
                                        createMany: {
                                            data: defaultActions.map((permission) => ({
                                                name: `${childSlug}:${permission}`,
                                                slug: useSlugify(permission),
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
export const SoftDeleteResource = async (data) => {
    return ResourceManage.delete("resource_id", data);
};
export const AddSubResources = async (id, data) => {
    const resource = await ResourceManage.readById(id, "slug");
    console.log("Resource to add sub-resource to:", data);
    return ResourceManage.update("slug", id, {
        children: {
            create: {
                name: data.data.name,
                order: data.data.order,
                slug: useSlugify(data.data.name),
                permissions: {
                    createMany: {
                        data: defaultActions.map((permission) => ({
                            name: `${useSlugify(data.data.name)}:${permission}`,
                            slug: useSlugify(permission),
                        })),
                    },
                },
            },
        },
    });
};
