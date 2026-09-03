import {
  CreateContributionSchema,
  UpdateContributionSchema,
} from "@/lib/validation/contribution.validation";
import {
  GetAllContributions,
  GetContributionById,
  CreateContribution,
  SoftDeleteContribution,
  UpdateContributeById,
} from "@/services/contribution.services";
import { Request, Response } from "express";
import z from "zod";
import id from "zod/v4/locales/id.cjs";

export const getAllContributions = async (
  request: Request,
  response: Response,
) => {
  const {
    after,
    before,
    search,
    sortBy,
    limit,
    classification,
    method,
    status,
    orderBy,
    type,
  } = request.query;

  const result = await GetAllContributions({
    after: after as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    classification: classification as string,
    method: method as string,
    status: status as string,
    type: type as string,
    limit: limit as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getContributionById = async (
  request: Request,
  response: Response,
) => {
  const id = String(request.params.id);
  const result = await GetContributionById(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createContribution = async (
  request: Request,
  response: Response,
) => {
  const parsedData = await CreateContributionSchema.safeParse(request.body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  const result = await CreateContribution(parsedData.data);
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const updateContribution = async (
  request: Request,
  response: Response,
) => {
  console.log(request.body);
  const parsedData = UpdateContributionSchema.safeParse(request.body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  const result = UpdateContributeById(parsedData.data);

  return response.status(200).json({
    ...result,
    success: true,
    timestamp: new Date(),
  });
};

export const softDeleteContribution = async (
  request: Request,
  response: Response,
) => {
  const result = await SoftDeleteContribution(String(request.params.id));
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
