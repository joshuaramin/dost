import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { prisma } from "@/lib/prisma/system/prisma";
import { AppError } from "@/lib/common/appError";
import { FormInterface } from "@/lib/interface/form.interface";
import { FormWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { id } from "zod/v4/locales/index.js";

const FormManage = new PrismaCRUDManager(prisma.form, "form_id");

export const GetAllForm = ({
  after,
  before,
  filter: { orderBy, search, sortBy },
  limit,
  type,
}: FormInterface) => {
  let where: FormWhereInput = {
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

export const GetFormById = async (id: string) => {
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

export const CreateForm = async (data: any) => {
  return await FormManage.create({
    description: data.description,
    image_url: data.image_url,
    type: data.type,
    user: { connect: { user_id: data.user_id } },
  });
};
