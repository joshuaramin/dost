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
      slug: true,
      children: {
        select: {
          resource_id: true,
          name: true,
          slug: true,
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

export const CreateResource = async (data: any[]) => {
  return await prisma.$transaction(async (tx) => {
    const defaultActions = [
      "create",
      "read",
      "update",
      "delete",
      "deny",
      "export",
    ];
    return await Promise.all(
      data.map(async (resource, resourceIndex: number) => {
        const slug = useSlugify(resource.name);

        return await tx.resource.create({
          data: {
            name: resource.name,
            slug,
            order: resource.order ?? resourceIndex + 1,

            permissions: {
              createMany: {
                data: defaultActions.map((permission: string) => ({
                  name: `${slug}:${permission}`,
                  slug: useSlugify(permission),
                })),
              },
            },

            children: resource.children?.length
              ? {
                  create: resource.children.map(
                    (child: { name: string }, index: number) => {
                      const childSlug = useSlugify(child.name);

                      return {
                        name: child.name,
                        order: index + 1,
                        slug: childSlug,

                        permissions: {
                          createMany: {
                            data: defaultActions.map((permission: string) => ({
                              name: `${childSlug}:${permission}`,
                              slug: useSlugify(permission),
                            })),
                          },
                        },
                      };
                    },
                  ),
                }
              : undefined,
          },
        });
      }),
    );
  });
};

export const SoftDeleteResource = async (data: any) => {
  return ResourceManage.delete(data.resource_id);
};
