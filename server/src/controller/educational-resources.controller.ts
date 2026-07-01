import { Request, Response } from "express";
import {
  CreateEducationResource,
  GetAllEducationResource,
} from "@/services/education-resources.services";
import { EducationResourceSchema } from "@/lib/validation/edcation-resource.validation";

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

export const createEducationResources = async (
  request: Request,
  response: Response,
) => {
  try {
    const body = request.body;

    const parseData = EducationResourceSchema.safeParse(body);

    if (!parseData.success) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: parseData.error.flatten().fieldErrors,
        timestamp: new Date(),
      });
    }

    const result = await CreateEducationResource({
      title: parseData.data.title,
      excerpt: parseData.data.excerpt,
      content: parseData.data.content,
      category: parseData.data.category,
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
