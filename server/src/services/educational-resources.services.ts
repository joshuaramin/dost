import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import {
  EducationalResourceInterface,
  EducationCategoryInterface,
  EducationTagInterface,
} from "@/lib/interface/education-resources.interface";
import {
  EducationResource,
  EducationAttachment,
  EducationCategory,
  EducationResourceTag,
  EducationResourceType,
  EducationStatus,
  EducationTag,
  Prisma,
} from "@/lib/prisma/system/generated/prisma/client";
import {
  EducationResourceWhereInput,
  EducationTagWhereInput,
  EducationCategoryWhereInput,
} from "@/lib/prisma/system/generated/prisma/models";
import { prisma } from "@/lib/prisma/system/prisma";

//Manage

const EducationResourceManage = new PrismaCRUDManager<
  EducationResource,
  "education_resource_id",
  typeof prisma.educationResource
>(prisma.educationResource, "education_resource_id");

const EducationTagManage = new PrismaCRUDManager<
  EducationTag,
  "education_tag_id",
  typeof prisma.educationTag
>(prisma.educationTag, "education_tag_id", false);

const EducationCategoryManage = new PrismaCRUDManager<
  EducationCategory,
  "education_category_id",
  typeof prisma.educationCategory
>(prisma.educationCategory, "education_category_id");

// Functions

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
      summary: true,
      category: true,
      title: true,
      slug: true,
      user: {
        select: {
          email: true,
          Profile: { select: { first_name: true, last_name: true } },
        },
      },
    },
  });
};

export const GetEducationByid = (data: string) => {
  return EducationResourceManage.readById(
    data,
    "slug",
    {
      select: {
        category: true,
        content: true,
        summary: true,
        slug: true,
        title: true,
        created_at: true,
        attachments: true,
        published_at: true,
        status: true,
        tags: true,
        thumbnail: true,
        type: true,
        user: {
          select: { email: true, Profile: true },
        },
      },
    },
    async (education) => {
      const related = await EducationResourceManage.read({
        where: {
          NOT: { slug: education.slug },
        },
      });

      return {
        ...education,
        related,
      };
    },
  );
};

export const GetEducationCategory = ({
  after,
  limit,
  filter: { orderBy, search, sortBy },
}: EducationCategoryInterface) => {
  let where: EducationCategoryWhereInput = {
    is_deleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  return EducationCategoryManage.read({
    where,
    cursor: after,
    limit,
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};

export const GetEducationTag = ({
  after,
  limit,
  filter: { orderBy, search, sortBy },
}: EducationTagInterface) => {
  let where: EducationTagWhereInput = {
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };
  return EducationTagManage.read({
    where,
    limit,
    cursor: after,
    orderBy: {
      [orderBy]: sortBy,
    },
  });
};
export const CreateEducationResource = (
  data: Prisma.EducationResourceCreateInput,
) => {
  return EducationResourceManage.create({
    category: data.category,
    content: data.content,
    slug: data.slug,
    summary: data.summary,
    title: data.title,
    type: data.type,
    attachments: data.attachments,
    status: data.status,
    is_featured: data.is_featured,
    published_at: data.published_at,
    tags: data.tags,
    thumbnail: data.thumbnail,
  });
};

export const CreateEducationTag = (data: Prisma.EducationTagCreateInput) => {
  return EducationTagManage.create({
    name: data.name,
    slug: data.slug,
  });
};

export const CreateEducationCategory = (
  data: Prisma.EducationCategoryCreateInput,
) => {
  return EducationCategoryManage.create({
    name: data.name,
    slug: data.slug,
  });
};
