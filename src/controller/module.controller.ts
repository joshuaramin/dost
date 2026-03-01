import { Response, Request } from "express";

import {
  CreateModule,
  GetAllModules,
  GetModuleBySlug,
  SoftDeleteModule,
} from "@/services/module.services";
import { ModuleSchema } from "@/lib/validation/module.validation";

export const getAllModule = async (request: Request, response: Response) => {
  try {
    const { first, after, orderBy, sortBy, search } = request.query;

    const result = await GetAllModules({
      after: after as string,
      filter: {
        orderBy: orderBy as string,
        search: search as string,
        sortBy: sortBy as string,
      },
      first: parseInt(first as string),
    });

    return {
      data: result,
      query: request.query.params,
      timestamp: new Date(Date.now()),
    };
  } catch (error) {
    return response.json({ message: "Internal Server Error" }).json(500);
  }
};
export const getModuleById = async (request: Request, response: Response) => {
  try {
    const id = String(request.params.id);
    const result = await GetModuleBySlug(id);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return response.json({ message: "Internal Server Error" }).status(500);
  }
};

export const createModule = async (request: Request, response: Response) => {
  try {
    const body = request.body;
    const parsedData = ModuleSchema.safeParse(body);

    if (!parsedData.success) {
      return {
        message: parsedData.error.flatten,
        timestamp: new Date(Date.now()),
      };
    }

    const result = await CreateModule(parsedData.data);

    return {
      success: true,
      data: result,
      timestamp: new Date(Date.now()),
    };
  } catch (error) {
    return response.json({ message: "Internal Server Error" }).status(500);
  }
};

export const softDeleteModule = async (
  response: Response,
  request: Request,
) => {
  try {
    const id = String(request.params.id);

    const result = await SoftDeleteModule(id);
    return {
      succes: true,
      data: result,
      timestamp: new Date(Date.now()),
    };
  } catch (error) {
    return response.json({ message: "Internal Server Error" }).status(500);
  }
};
