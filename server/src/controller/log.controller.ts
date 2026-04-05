import { GetAllActivityLogs } from "@/services/log.services";
import { Request, Response } from "express";

export const getAllActivityLogs = async (
  request: Request,
  response: Response,
) => {
  try {
    const { limit, sortBy, orderBy, search, after } = request.query;

    const id = String(request.params.id);
    const result = await GetAllActivityLogs(id, {
      after: after as string,
      limit: limit as string,
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
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};
