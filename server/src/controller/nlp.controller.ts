import { GetGroupedHeatMapGeo } from "@/services/nlp.services";
import { Request, Response } from "express";

export const getAllHeatMapGeo = async (
  request: Request,
  response: Response,
) => {
  try {
    const result = await GetGroupedHeatMapGeo();

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
