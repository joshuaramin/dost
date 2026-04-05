import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import useSlugify from "@/lib/helpers/useSlugify";
import { RoleInterface } from "@/lib/interface/roles.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import { Prisma, Role } from "@/lib/prisma/system/generated/prisma/client";

const RoleManage = new PrismaCRUDManager<Role, "role_id", typeof prisma.role>(
  prisma.role,
  "role_id",
);

export const GetAllRoles = ({
  limit,
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
    limit,
    ...(after && {
      cursor: after,
    }),
    orderBy: {
      [orderBy]: sortBy,
    },
    select: {
      role_id: true,
      name: true,
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

export const SoftDeleteRole = async (data: any) => {
  return RoleManage.delete(data.role_id);
};

export const AddRolePermission = async (role_id: string, data: any) => {
  console.log("Data: ", data);
  return RoleManage.update(role_id, {
    rolePermissions: {
      createMany: {
        data: data.permissions.map((permissions: { permissions: string }) => ({
          permission_id: permissions,
        })),
        skipDuplicates: true,
      },
    },
  });
};
