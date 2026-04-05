import useSlugify from "@/lib/helpers/useSlugify";
import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { ResourceInterface } from "@/lib/interface/resource.interface";
import { prisma } from "@/lib/prisma/system/prisma";
import { Prisma, Resource } from "@/lib/prisma/system/generated/prisma/client";

const ResourceManage = new PrismaCRUDManager<
  Resource,
  "resource_id",
  typeof prisma.resource
>(prisma.resource, "resource_id");

export const GetAllResource = ({
  limit,
  after,
  filter: { orderBy, search, sortBy },
}: ResourceInterface) => {
  let where: Prisma.ResourceWhereInput = {
    is_deleted: false,
    parent: null,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  return ResourceManage.read({
    where,
    limit,
    ...(after && {
      cursor: after,
    }),
    orderBy: {
      [orderBy]: sortBy,
    },
    select: {
      resource_id: true,
      name: true,
      children: {
        select: {
          resource_id: true,
          name: true,
        },
      },
      created_at: true,
      updated_at: true,
    },
  });
};

export const GetResourceBySlug = (data: any) => {
  return ResourceManage.readById(data.key, "slug");
};

export const UpdateResourceById = async (id: string, data: any) => {
  return ResourceManage.update(id, data);
};

export const CreateResource = async (data: any) => {
  const slug = useSlugify(data.name);
  const defaultActions = [
    "create",
    "read",
    "updated",
    "delete",
    "deny",
    "export",
  ];

  return ResourceManage.create({
    name: data.name,
    slug,
    order: data.order,
    permissions: {
      createMany: {
        data: defaultActions.map((permission) => ({
          name: `${slug}:${permission}`,
          slug: useSlugify(permission),
        })),
      },
    },

    children: {
      create: data.children.map(
        ({ name }: { name: string }, index: number) => ({
          name,
          order: index + 1,
          slug: useSlugify(name),
          permissions: {
            createMany: {
              data: defaultActions.map((permission) => ({
                name: `${useSlugify(name)}:${permission}`,
                slug: useSlugify(permission),
              })),
            },
          },
        }),
      ),
    },
  });
};

export const SoftDeleteResource = async (data: any) => {
  return ResourceManage.delete(data.resource_id);
};
