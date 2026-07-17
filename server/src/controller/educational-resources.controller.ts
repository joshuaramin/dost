import { Request, Response } from "express";
import {
  CreateEducationResource,
  GetAllEducationResource,
  CreateEducationCategory,
  CreateEducationTag,
  GetEducationCategory,
  GetEducationByid,
  GetEducationTag,
} from "@/services/educational-resources.services";
import {
  CreateEducationCategorySchema,
  CreateEducationResourceSchema,
  CreateEducationTagSchema,
} from "@/lib/validation/educational-resource.validation";
import useSlugify from "@/lib/helpers/useSlugify";
import { getAttachmentType } from "@/lib/helpers/useGetAttachment";

export const getAllEducationResources = async (
  request: Request,
  response: Response,
) => {
  const { sortBy, orderBy, limit, after, search } = request.query;

  const result = await GetAllEducationResource({
    limit: limit as string,
    after: after as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getEducationById = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);
  const result = await GetEducationByid(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getAllEducationCategory = async (
  request: Request,
  response: Response,
) => {
  const { sortBy, orderBy, limit, after, search } = request.query;

  const result = await GetEducationCategory({
    limit: limit as string,
    after: after as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getEducationTag = async (request: Request, response: Response) => {
  const { sortBy, orderBy, limit, after, search } = request.query;

  const result = await GetEducationTag({
    limit: limit as string,
    after: after as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(),
    success: true,
  });
};

export const createEducationTag = async (
  request: Request,
  response: Response,
) => {
  const body = request.body;
  const parseData = CreateEducationTagSchema.safeParse(body);

  if (!parseData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: parseData.error.flatten().fieldErrors,
      timestamp: new Date(),
    });
  }

  const result = await CreateEducationTag({
    name: parseData.data.name,
    slug: useSlugify(parseData.data.name),
  });

  return response.status(200).json({
    ...result,
    success: true,
    timestamp: new Date(),
  });
};

export const createEducationCategory = async (
  request: Request,
  response: Response,
) => {
  const body = request.body;
  const parseData = CreateEducationCategorySchema.safeParse(body);

  if (!parseData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: parseData.error.flatten().fieldErrors,
      timestamp: new Date(),
    });
  }

  const result = await CreateEducationCategory({
    name: parseData.data.name,
    description: parseData.data.description,
    slug: useSlugify(parseData.data.name),
  });

  return response.status(200).json({
    ...result,
    success: true,
    timestamp: new Date(),
  });
};

export const createEducationResources = async (
  request: Request,
  response: Response,
) => {
  try {
    const body = request.body;

    const parseData = CreateEducationResourceSchema.safeParse(body);

    if (!parseData.success) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: parseData.error.flatten().fieldErrors,
        timestamp: new Date(),
      });
    }

    const thumbnail = request.file as Express.MulterS3.File;
    const attachments = request.files as Express.MulterS3.File[];

    const result = await CreateEducationResource({
      title: parseData.data.title,
      summary: parseData.data.summary,
      slug: useSlugify(parseData.data.title),
      content: parseData.data.content,
      status: parseData.data.status,
      is_featured: parseData.data.is_featured,
      type: parseData.data.type,
      ...(thumbnail && {
        thumbnail: `${process.env.CDN_URL}/${thumbnail.key}`,
      }),

      ...(attachments?.length && {
        attachments: {
          create: attachments.map((file, index) => ({
            type: getAttachmentType(file.mimetype),
            file_name: file.originalname,
            file_url: `${process.env.CDN_URL}/${file.key}`,
            mime_type: file.mimetype,
            file_size: file.size,
            order_index: index,
          })),
        },
      }),

      ...(parseData.data.tags?.length && {
        EducationResourceTag: {
          create: parseData.data.tags.map((tag) => ({
            tag: {
              connect: {
                education_tag_id: tag.education_tag_id,
              },
            },
          })),
        },
      }),

      category: {
        connect: { education_category_id: parseData.data.category_id },
      },
      user: { connect: { user_id: parseData.data.user_id } },
    });

    return response.status(200).json({
      ...result,
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Something went wrong",
      timestamp: new Date(),
    });
  }
};
