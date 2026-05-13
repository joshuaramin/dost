import { CreateUserSchema, UserSchema } from "@/lib/validation/user.validation";
import {
  CreateUser,
  GetAllUsers,
  GetUserById,
  SoftDeleteUser,
} from "@/services/user.services";
import { Request, Response } from "express";
import z from "zod";

export const getAllUsers = async (request: Request, response: Response) => {
  const { after, orderBy, search, sortBy, limit } = request.query;
  const result = await GetAllUsers({
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

export const getUserById = async (request: Request, response: Response) => {
  const id = String(request.params.id);
  const result = await GetUserById(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createUser = async (request: Request, response: Response) => {
  const parsedData = await CreateUserSchema.safeParse(request.body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  console.log(parsedData.data);
  const result = await CreateUser(parsedData.data);
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const softDeleteUser = async (request: Request, response: Response) => {
  const result = await SoftDeleteUser(request.params.id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
