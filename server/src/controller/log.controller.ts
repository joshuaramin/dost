import { CreateActivityLog } from "@/lib/validation/activity-log.validation";
import {
  CreateActivityLogs,
  GetAllActivityLogs,
} from "@/services/log.services";
import { Request, Response } from "express";
import { z } from "zod";

export const getAllActivityLogs = async (
  request: Request,
  response: Response,
) => {
  const { limit, sortBy, orderBy, search, after, before } = request.query;

  const id = String(request.params.id);
  const result = await GetAllActivityLogs(id, {
    after: after as string,
    limit: limit as string,
    before: before as string,
    filter: {
      orderBy: orderBy as string,
      sortBy: sortBy as string,
      search: search as string,
    },
  });
  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};

export const createActivityLgos = async (
  request: Request,
  response: Response,
) => {
  const body = request.body;

  const parsedData = CreateActivityLog.safeParse(body);

  if (!parsedData.success) {
    return response.status(400).json({
      message: "Invalid Schema",
      schema: z.flattenError(parsedData.error),
      timestamp: new Date(Date.now()),
    });
  }

  const result = await CreateActivityLogs(parsedData.data);

  return response.status(200).json({
    ...result,
    timestamp: new Date(Date.now()),
    success: true,
  });
};
