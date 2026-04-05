import { GetAllDeviceSession } from "@/services/deviceSession.services";
import { Request, Response } from "express";

export const getAllDeviceSesisonByUserId = async (
  request: Request,
  response: Response,
) => {
  try {
    const id = String(request.params.id);
    const { limit, after, orderBy, sortBy, search } = request.query;

    const result = await GetAllDeviceSession(id, {
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
    return response.status(500).json({
      message: "Internal Server Error",
      success: false,
      timestamp: new Date(Date.now()),
    });
  }
};
