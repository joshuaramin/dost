import { GetAllAdminGeo, GetRegionHierarchy } from "@/services/geom.services";
import { Request, Response } from "express";

export const getAllGeom = async (request: Request, response: Response) => {
  try {
    const result = await GetAllAdminGeo();

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

export const getRegions = async (req: Request, res: Response) => {
  try {
    const data = await GetRegionHierarchy();

    return res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("getRegions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};
