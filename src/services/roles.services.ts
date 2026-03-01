import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import useSlugify from "@/lib/helpers/useSlugify";
import { RoleInterface } from "@/lib/interface/roles.interface";
import { prisma } from "@/lib/prisma";
import { Prisma, Role } from "@/lib/prisma/generated/prisma/client";

const RoleManage = new PrismaCRUDManager<Role, "role_id", typeof prisma.role>(
  prisma.role,
  "role_id",
);

export const GetAllRoles = ({
  first,
  filter: { orderBy, search, sortBy },
  after,
}: RoleInterface) => {
  let where: Prisma.RoleWhereInput = {
    is_deleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  return RoleManage.read({
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
export const GetRoleBySlug = async (data: any) => {
  return RoleManage.readById(data.key, "slug");
};

export const CreateRole = async (data: any) => {
  return RoleManage.create({
    name: data.name,
    slug: useSlugify(data.name),
    description: data.description,
  });
};

export const DeleteRole = async (data: any) => {
  return RoleManage.delete(data.role_id);
};
