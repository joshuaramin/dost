import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import useSlugify from "@/lib/helpers/useSlugify";
import { Moduleinterface } from "@/lib/interface/module.interface";
import { prisma } from "@/lib/prisma";
import { Prisma, Module } from "@/lib/prisma/generated/prisma/client";

const ModuleManage = new PrismaCRUDManager<
  Module,
  "module_id",
  typeof prisma.module
>(prisma.module, "module_id");

export const GetAllModules = ({
  first,
  after,
  filter: { orderBy, search, sortBy },
}: Moduleinterface) => {
  let where: Prisma.ModuleWhereInput = {
    is_deleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  return ModuleManage.read({
    where,
    limit: first + 1,
    ...(after && {
      cursor: after,
    }),
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};

export const GetModuleBySlug = (data: any) => {
  return ModuleManage.readById(data.key, "slug");
};

export const CreateModule = async (data: any) => {
  return ModuleManage.create({
    name: data.name,
    slug: useSlugify(data.name),
  });
};

export const SoftDeleteModule = async (data: any) => {
  return ModuleManage.delete(data.module_id);
};
