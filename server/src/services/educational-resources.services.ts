import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import {
  EducationalResourceInterface,
  EducationCategoryInterface,
  EducationTagInterface,
} from "@/lib/interface/education-resources.interface";
import {
  EducationResource,
  EducationCategory,
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
  resource,
  status,
  category,
  type,
  before,
}: EducationalResourceInterface) => {
  const statusFilter = status ? (status as EducationStatus) : undefined;
  const typeFilter = type ? (type as EducationResourceType) : undefined;

  let where: EducationResourceWhereInput = {
    is_deleted: false,
    ...(typeFilter && {
      type: typeFilter,
    }),
    ...(statusFilter && {
      status: statusFilter,
    }),
    ...(resource && {
      education_resource_id: resource,
    }),
    ...(category && {
      category: { name: category },
    }),
    ...(search && {
      title: { contains: search, mode: "insensitive" },
    }),
  };

  return EducationResourceManage.read({
    where,
    limit,
    ...(after && {
      cursor: after,
      direction: "forward",
    }),
    ...(before && {
      cursor: before,
      direction: "backward",
    }),
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
      attachments: true,
      status: true,
      thumbnail: true,
      tags: true,
      type: true,
      is_deleted: true,
      category_id: true,
      external_link: true,
      published_at: true,
      created_at: true,
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
        external_link: true,
        type: true,
        category: {
          select: {
            education_category_id: true,
            name: true,
          },
        },
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
    is_deleted: data.is_deleted,
    published_at: data.published_at,
    tags: data.tags,
    thumbnail: data.thumbnail,
    external_link: data.external_link,
    user: data.user,
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

export const SoftDeleteEducationResource = (data: any) => {
  return EducationResourceManage.delete(data);
};
