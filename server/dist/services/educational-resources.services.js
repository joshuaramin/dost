import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
//Manage
const EducationResourceManage = new PrismaCRUDManager(prisma.educationResource, "education_resource_id");
const EducationTagManage = new PrismaCRUDManager(prisma.educationTag, "education_tag_id", false);
const EducationCategoryManage = new PrismaCRUDManager(prisma.educationCategory, "education_category_id");
// Functions
export const GetAllEducationResource = ({ after, filter: { orderBy, search, sortBy }, limit, resource, status, category, type, before, }) => {
    const statusFilter = status ? status : undefined;
    const typeFilter = type ? type : undefined;
    let where = {
        is_deleted: false,
        ...(typeFilter && {
            type: typeFilter,
        }),
        ...(statusFilter && {
            status: statusFilter,
        }),
        ...(resource && {
            education_resource_id: resource,
        }),
        ...(category && {
            category: { name: category },
        }),
        ...(search && {
            title: { contains: search, mode: "insensitive" },
        }),
    };
    return EducationResourceManage.read({
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
            education_resource_id: true,
            content: true,
            summary: true,
            category: true,
            title: true,
            slug: true,
            attachments: true,
            status: true,
            tags: true,
            type: true,
            is_deleted: true,
            category_id: true,
            external_link: true,
            published_at: true,
            created_at: true,
            user: {
                select: {
                    email: true,
                    Profile: { select: { first_name: true, last_name: true } },
                },
            },
        },
    });
};
export const GetEducationByid = (data) => {
    return EducationResourceManage.readById(data, "slug", {
        select: {
            content: true,
            summary: true,
            slug: true,
            title: true,
            created_at: true,
            attachments: true,
            published_at: true,
            status: true,
            tags: true,
            external_link: true,
            type: true,
            education_resource_id: true,
            category: {
                select: {
                    education_category_id: true,
                    name: true,
                },
            },
            user: {
                select: { email: true, Profile: true },
            },
        },
    }, async (education) => {
        const related = await EducationResourceManage.read({
            where: {
                NOT: { slug: education.slug },
            },
        });
        return {
            ...education,
            related,
        };
    });
};
export const GetEducationCategory = ({ after, limit, filter: { orderBy, search, sortBy }, }) => {
    let where = {
        is_deleted: false,
        ...(search && {
            name: { contains: search, mode: "insensitive" },
        }),
    };
    return EducationCategoryManage.read({
        where,
        cursor: after,
        limit,
        orderBy: {
            [orderBy]: sortBy,
        },
    });
};
export const GetEducationTag = ({ after, limit, filter: { orderBy, search, sortBy }, }) => {
    let where = {
        ...(search && {
            name: { contains: search, mode: "insensitive" },
        }),
    };
    return EducationTagManage.read({
        where,
        limit,
        cursor: after,
        orderBy: {
            [orderBy]: sortBy,
        },
    });
};
export const CreateEducationResource = (data) => {
    return EducationResourceManage.create({
        category: data.category,
        content: data.content,
        slug: data.slug,
        summary: data.summary,
        title: data.title,
        type: data.type,
        attachments: data.attachments,
        status: data.status,
        is_featured: data.is_featured,
        is_deleted: data.is_deleted,
        published_at: data.published_at,
        tags: data.tags,
        external_link: data.external_link,
        user: data.user,
    });
};
export const UpdateEducationalResourcre = (id, data) => {
    return EducationResourceManage.update("slug", id, {
        category_id: data.category,
        content: data.content,
        slug: data.slug,
        summary: data.summary,
        title: data.title,
        type: data.type,
        attachments: data.attachments,
        status: data.status,
        is_featured: data.is_featured,
        published_at: data.published_at,
        tags: data.tags,
        external_link: data.external_link,
        user: data.user,
    });
};
export const CreateEducationTag = (data) => {
    return EducationTagManage.create({
        name: data.name,
        slug: data.slug,
    });
};
export const CreateEducationCategory = (data) => {
    return EducationCategoryManage.create({
        name: data.name,
        slug: data.slug,
    });
};
export const SoftDeleteEducationResource = (data) => {
    console.log("DELETE", data);
    return EducationResourceManage.delete("slug", data);
};
