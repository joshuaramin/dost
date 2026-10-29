import { PrismaCRUDManager } from "../lib/helpers/useCrud.js";
import { prisma } from "../lib/prisma/system/prisma.js";
const FormManage = new PrismaCRUDManager(prisma.form, "form_id");
export const GetAllForm = ({ after, before, filter: { orderBy, search, sortBy }, limit, type, }) => {
    let where = {
        is_deleted: false,
        ...(type && {
            type: type,
        }),
    };
    return FormManage.read({
        where,
        limit,
        orderBy: { [orderBy]: sortBy },
        ...(after && { cursor: after, direction: "forward" }),
        ...(before && { cursor: before, direction: "backward" }),
        select: {
            form_id: true,
            image_url: true,
            description: true,
            type: true,
            created_at: true,
        },
    });
};
export const GetFormById = async (id) => {
    return await FormManage.readById({
        where: { form_id: id, is_deleted: false },
        select: {
            form_id: true,
            image_url: true,
            description: true,
            type: true,
            created_at: true,
        },
    });
};
export const CreateForm = async (data) => {
    return await FormManage.create({
        description: data.description,
        image_url: data.image_url,
        type: data.type,
        user: { connect: { user_id: data.user_id } },
    });
};
