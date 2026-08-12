import { Request, Response } from "express";
import {
  CreateEducationResource,
  GetAllEducationResource,
  CreateEducationCategory,
  CreateEducationTag,
  GetEducationCategory,
  GetEducationByid,
  GetEducationTag,
  SoftDeleteEducationResource,
} from "@/services/educational-resources.services";
import {
  CreateEducationCategorySchema,
  CreateEducationResourceBodySchema,
  CreateEducationResourceSchema,
  CreateEducationTagSchema,
} from "@/lib/validation/educational-resource.validation";
import useSlugify from "@/lib/helpers/useSlugify";
import { getAttachmentType } from "@/lib/helpers/useGetAttachment";

export const getAllEducationResources = async (
  request: Request,
  response: Response,
) => {
  const {
    sortBy,
    orderBy,
    limit,
    after,
    search,
    status,
    type,
    resource,
    category,
    before,
  } = request.query;

  const result = await GetAllEducationResource({
    limit: limit as string,
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    resource: resource as string,
    status: status as string,
    category: category as string,
    type: type as string,
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
  const { sortBy, orderBy, limit, after, search, before } = request.query;

  const result = await GetEducationCategory({
    limit: limit as string,
    after: after as string,
    before: before as string,
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
  const { sortBy, orderBy, limit, after, search, before } = request.query;

  const result = await GetEducationTag({
    limit: limit as string,
    after: after as string,
    before: before as string,
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

    const files =
      (request.files as {
        thumbnail?: Express.MulterS3.File[];
        attachments?: Express.MulterS3.File[];
      }) ?? {};

    const thumbnail = files.thumbnail?.[0];

    const attachments = files.attachments ?? [];

    console.log("BODY:", body);
    console.log("ATTACHMENTS:", attachments);
    console.log("THUMBNAIL:", thumbnail);

    const parseData = CreateEducationResourceBodySchema.safeParse(body);

    if (!parseData.success) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: parseData.error.flatten().fieldErrors,
        timestamp: new Date(),
      });
    }

    const data = parseData.data;

    if (data.type === "ARTICLE" && !data.content?.trim()) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: {
          content: ["Content is required for an article."],
        },
        timestamp: new Date(),
      });
    }

    if (data.type === "EXTERNAL_LINK" && !data.external_link?.trim()) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: {
          external_link: ["External link is required."],
        },
        timestamp: new Date(),
      });
    }

    if (data.type === "CATALOGUE" && attachments.length === 0) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: {
          attachments: ["Please upload at least one attachment."],
        },
        timestamp: new Date(),
      });
    }

    let tags = [];

    if (data.tags) {
      try {
        const parsedTags = JSON.parse(data.tags);

        if (Array.isArray(parsedTags)) {
          tags = parsedTags;
        }
      } catch {
        tags = [];
      }
    }

    const result = await CreateEducationResource({
      title: data.title,

      summary: data.summary,

      slug: useSlugify(data.title),

      content: data.content,

      status: data.status,

      type: data.type,

      is_deleted: data.is_deleted,

      external_link: data.external_link,

      is_featured: data.is_featured,

      ...(thumbnail
        ? {
            thumbnail: `${process.env.CDN_URL}/${thumbnail.key}`,
          }
        : {}),

      ...(attachments.length > 0
        ? {
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
          }
        : {}),

      ...(tags.length > 0
        ? {
            EducationResourceTag: {
              create: tags.map((tag) => ({
                tag: {
                  connect: {
                    education_tag_id: tag.education_tag_id,
                  },
                },
              })),
            },
          }
        : {}),

      category: {
        connect: {
          education_category_id: data.category_id,
        },
      },

      ...(data.user_id
        ? {
            user: {
              connect: {
                user_id: data.user_id,
              },
            },
          }
        : {}),
    });

    return response.status(200).json({
      ...result,
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("CREATE EDUCATION RESOURCE ERROR:", error);

    return response.status(500).json({
      message: "Something went wrong",
      timestamp: new Date(),
    });
  }
};

export const softDeleteEducationResource = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);

  console.log("Educational Resourcre ID: ", id);

  const result = await SoftDeleteEducationResource(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
