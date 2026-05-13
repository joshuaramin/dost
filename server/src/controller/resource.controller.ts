import { Response, Request } from "express";

import {
  CreateResource,
  GetAllResource,
  GetResourceBySlug,
  SoftDeleteResource,
  UpdateResourceById,
} from "@/services/resource.services";
import { ResourceSchema } from "@/lib/validation/resource.validation";

export const getAllResource = async (request: Request, response: Response) => {
  const { limit, after, orderBy, sortBy, search } = request.query;

  const result = await GetAllResource({
    after: after as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    limit: limit as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
export const getResourceById = async (request: Request, response: Response) => {
  const id = String(request.params.id);
  const result = await GetResourceBySlug(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createResource = async (request: Request, response: Response) => {
  const parsedData = ResourceSchema.safeParse(request.body.resource);

  if (!parsedData.success) {
    return response.status(400).json({
      message: parsedData.error.flatten(),
      success: false,
      timestamp: new Date(),
    });
  }

  const result = await CreateResource(parsedData.data);

  return response.status(201).json({
    data: result,
    success: true,
    timestamp: new Date(),
  });
};
export const updateResource = async (request: Request, response: Response) => {
  const id = String(request.params.id);
  const parsedData = ResourceSchema.safeParse(request.body);

  const result = await UpdateResourceById(id, parsedData.data);
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const softDeleteResource = async (
  response: Response,
  request: Request,
) => {
  const id = String(request.params.id);

  const result = await SoftDeleteResource(id);
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
