import { GetAllAdminGeo, GetRegions, GetProvinces, GetMunicipalities, GetRegionHierarchy, GetBarangays, } from "../services/geom.services.js";
export const getAllGeom = async (_req, res) => {
    try {
        const result = await GetAllAdminGeo();
        return res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            ...result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            timestamp: new Date().toISOString(),
        });
    }
};
export const getRegions = async (_req, res) => {
    try {
        const data = await GetRegions();
        return res.status(200).json({
            success: true,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            timestamp: new Date().toISOString(),
        });
    }
};
export const getProvinces = async (req, res) => {
    try {
        const { region_code } = req.query;
        const data = await GetProvinces(Number(region_code));
        return res.status(200).json({
            success: true,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            timestamp: new Date().toISOString(),
        });
    }
};
export const getMunicipalities = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            timestamp: new Date().toISOString(),
        });
    }
};
export const getBarangays = async (req, res) => {
    try {
        const { municipality_code } = req.query;
        const data = await GetBarangays(Number(municipality_code));
        return res.status(200).json({
            success: true,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            timestamp: new Date().toISOString(),
        });
    }
};
export const getRegionsHierachy = async (request, response) => {
    try {
        const data = await GetRegionHierarchy();
        return response.status(200).json({
            success: true,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({});
    }
};
