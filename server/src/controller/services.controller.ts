import {
  CreateTreatmentHubService,
  GetAllTreatmentHubService,
} from "@/services/services.services";
import { Request, Response } from "express";

export const getAllTreatmentHubService = async (
  request: Request,
  response: Response,
) => {
  const { after, orderBy, search, sortBy, limit, before } = request.query;

  const result = await GetAllTreatmentHubService({
    after: after as string,
    before: before as string,
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

export const createTreatmentHubService = async (
  request: Request,
  response: Response,
) => {
  const body = request.body;

  const result = await CreateTreatmentHubService(body);
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
