import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { EducationalResourceInterface } from "@/lib/interface/education-resources.interface";
import { EducationResource } from "@/lib/prisma/system/generated/prisma/client";
import { EducationResourceWhereInput } from "@/lib/prisma/system/generated/prisma/models";
import { prisma } from "@/lib/prisma/system/prisma";

const EducationResourceManage = new PrismaCRUDManager<
  EducationResource,
  "education_resource_id",
  typeof prisma.educationResource
>(prisma.educationResource, "education_resource_id");

export const GetAllEducationResource = ({
  after,
  filter: { orderBy, search, sortBy },
  limit,
}: EducationalResourceInterface) => {
  let where: EducationResourceWhereInput = {
    is_deleted: false,
    ...(search && {
      title: { contains: search, mode: "insensitive" },
    }),
  };

  return EducationResourceManage.read({
    where,
    limit,
    cursor: after,
    orderBy: {
      [orderBy]: sortBy,
    },
    select: {
      education_resource_id: true,
      content: true,
      excerpt: true,
      category: true,
      title: true,
      user: {
        select: {
          email: true,
          Profile: { select: { first_name: true, last_name: true } },
        },
      },
    },
  });
};

export const CreateEducationResource = (data: any) => {
  return EducationResourceManage.create({
    category: data.category,
    content: data.content,
    excerpt: data.excerpt,
    title: data.title,
  });
};
