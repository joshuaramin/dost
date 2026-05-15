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
export const GetRoleBySlug = async (data: any) => {
  return RoleManage.readById(data, "slug", {
    select: {
      name: true,
      description: true,
      rolePermissions: true,
    },
  });
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
  console.log("Role ID: ", role_id);

  console.log("Body: ", data);
  const existing = await prisma.permission.findMany({
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
