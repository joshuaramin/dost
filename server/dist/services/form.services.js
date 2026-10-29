"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateForm = exports.GetFormById = exports.GetAllForm = void 0;
const useCrud_1 = require("../lib/helpers/useCrud.js");
const prisma_1 = require("../lib/prisma/system/prisma.js");
const FormManage = new useCrud_1.PrismaCRUDManager(prisma_1.prisma.form, "form_id");
const GetAllForm = ({ after, before, filter: { orderBy, search, sortBy }, limit, type, }) => {
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
exports.GetAllForm = GetAllForm;
const GetFormById = async (id) => {
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
exports.GetFormById = GetFormById;
const CreateForm = async (data) => {
    return await FormManage.create({
        description: data.description,
        image_url: data.image_url,
        type: data.type,
        user: { connect: { user_id: data.user_id } },
    });
};
exports.CreateForm = CreateForm;
