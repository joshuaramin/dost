import { Response, Request } from "express";

import {
  CreateResource,
  GetAllResource,
  GetResourceBySlug,
  SoftDeleteResource,
  UpdateResourceById,
} from "@/services/resource.services";
import { ResoucreSchema } from "@/lib/validation/resource.validation";

export const getAllResource = async (request: Request, response: Response) => {
  try {
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
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};
export const getResourceById = async (request: Request, response: Response) => {
  try {
    const id = String(request.params.id);
    const result = await GetResourceBySlug(id);

    return response.status(200).json({
      ...result,
      timestamp: new Date(Date.now()),
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};

export const createResource = async (request: Request, response: Response) => {
  try {
    const body = request.body;
    const parsedData = ResoucreSchema.safeParse(body);

    if (!parsedData.success) {
      return {
        message: parsedData.error.flatten,
        timestamp: new Date(Date.now()),
      };
    }

    const result = await CreateResource(parsedData.data);

    return response.status(200).json({
      ...result,
      timestamp: new Date(Date.now()),
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};

export const updateResource = async (request: Request, response: Response) => {
  try {
    const id = String(request.params.id);
    const parsedData = ResoucreSchema.safeParse(request.body);

    const result = await UpdateResourceById(id, parsedData.data);
    return response.status(200).json({
      ...result,
      timestamp: new Date(Date.now()),
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};

export const softDeleteResource = async (
  response: Response,
  request: Request,
) => {
  try {
    const id = String(request.params.id);

    const result = await SoftDeleteResource(id);
    return response.status(200).json({
      ...result,
      timestamp: new Date(Date.now()),
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};
