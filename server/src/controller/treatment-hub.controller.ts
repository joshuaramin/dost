import { Request, Response } from "express";
import {
  CreateTreatmentHub,
  GetAllTreatmentHub,
  GetTreatmentHubBySlug,
} from "@/services/treatment-hub.services";
import { CreateTreatmentHubSchema } from "@/lib/validation/treatment-hub.validation";
import { z } from "zod";

export const getAllTreatmentHub = async (
  request: Request,
  response: Response,
) => {
  const { after, orderBy, search, sortBy, limit, before, psgc_code } =
    request.query;

  const result = await GetAllTreatmentHub({
    after: after as string,
    before: before as string,
    limit: limit as string,
    filter: {
      orderBy: orderBy as string,
      search: search as string,
      sortBy: sortBy as string,
    },
    psgc_code: psgc_code as string,
  });

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const getTreatmentHubById = (request: Request, response: Response) => {
  const id = String(request.params.slug);

  const result = GetTreatmentHubBySlug(id);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createTreatmentHub = async (
  request: Request,
  response: Response,
) => {
  const parsedData = await CreateTreatmentHubSchema.safeParse(request.body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  const result = await CreateTreatmentHub(parsedData.data);
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
