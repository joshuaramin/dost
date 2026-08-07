import { Request, Response } from "express";
import {
  GetAllAdminGeo,
  GetRegions,
  GetProvinces,
  GetMunicipalities,
  GetRegionHierarchy,
  GetBarangays,
} from "@/services/geom.services";

export const getAllGeom = async (_req: Request, res: Response) => {
  try {
    const result = await GetAllAdminGeo();

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const getRegions = async (_req: Request, res: Response) => {
  try {
    const data = await GetRegions();

    return res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const getProvinces = async (req: Request, res: Response) => {
  try {
    const { region_code } = req.query;

    if (!region_code || typeof region_code !== "string") {
      return res.status(400).json({
        success: false,
        message: "region_code is required.",
        timestamp: new Date().toISOString(),
      });
    }

    const data = await GetProvinces(region_code);

    return res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const getMunicipalities = async (req: Request, res: Response) => {
  try {
    const { province_code } = req.query;

    if (!province_code || typeof province_code !== "string") {
      return res.status(400).json({
        success: false,
        message: "province_code is required.",
        timestamp: new Date().toISOString(),
      });
    }

    const data = await GetMunicipalities(province_code);

    return res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const getBarangays = async (req: Request, res: Response) => {
  try {
    const { municipality_code } = req.query;

    if (!municipality_code || typeof municipality_code !== "string") {
      return res.status(400).json({
        success: false,
        message: "municipality_code is required.",
        timestamp: new Date().toISOString(),
      });
    }

    const data = await GetBarangays(municipality_code);

    return res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const getRegionsHierachy = async (
  request: Request,
  response: Response,
) => {
  try {
    const data = await GetRegionHierarchy();

    return response.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);

    return response.status(500).json({});
  }
};
