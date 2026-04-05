import { RoleSchema } from "@/lib/validation/Role.validation";
import {
  AddRolePermission,
  CreateRole,
  GetAllRoles,
  GetRoleBySlug,
  SoftDeleteRole,
} from "@/services/roles.services";
import { Request, Response } from "express";

export const getAllRoles = async (request: Request, response: Response) => {
  try {
    const { sortBy, orderBy, limit, search, after } = request.query;

    const result = await GetAllRoles({
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
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};

export const getRoleBySlug = async (request: Request, response: Response) => {
  try {
    const id = request.params.slug;

    const result = await GetRoleBySlug(id);
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

export const createRoles = async (request: Request, response: Response) => {
  try {
    const parsedData = RoleSchema.safeParse(request.body);

    if (!parsedData.success) {
      return response.status(400).json({
        message: "Invalid Schema",
        schema: parsedData.error.flatten().fieldErrors,
        timestamp: new Date(Date.now()),
      });
    }

    const result = await CreateRole(parsedData.data);

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

export const softDeleteRoles = async (request: Request, response: Response) => {
  try {
    const id = String(request.params.id);
    const result = await SoftDeleteRole(id);

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

export const addRolePermission = async (
  request: Request,
  response: Response,
) => {
  try {
    const id = String(request.params.id);
    const body = request.body;

    console.log("ID", id);
    console.log("Body", body);

    const result = await AddRolePermission(id, body);

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
