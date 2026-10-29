"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionsHierachy = exports.getBarangays = exports.getMunicipalities = exports.getProvinces = exports.getRegions = exports.getAllGeom = void 0;
const geom_services_1 = require("../services/geom.services.js");
const getAllGeom = async (_req, res) => {
    try {
        const result = await (0, geom_services_1.GetAllAdminGeo)();
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
exports.getAllGeom = getAllGeom;
const getRegions = async (_req, res) => {
    try {
        const data = await (0, geom_services_1.GetRegions)();
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
exports.getRegions = getRegions;
const getProvinces = async (req, res) => {
    try {
        const { region_code } = req.query;
        const data = await (0, geom_services_1.GetProvinces)(Number(region_code));
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
exports.getProvinces = getProvinces;
const getMunicipalities = async (req, res) => {
    try {
        const { province_code } = req.query;
        if (!province_code || typeof province_code !== "string") {
            return res.status(400).json({
                success: false,
                message: "province_code is required.",
                timestamp: new Date().toISOString(),
            });
        }
        const data = await (0, geom_services_1.GetMunicipalities)(province_code);
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
exports.getMunicipalities = getMunicipalities;
const getBarangays = async (req, res) => {
    try {
        const { municipality_code } = req.query;
        const data = await (0, geom_services_1.GetBarangays)(Number(municipality_code));
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
exports.getBarangays = getBarangays;
const getRegionsHierachy = async (request, response) => {
    try {
        const data = await (0, geom_services_1.GetRegionHierarchy)();
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
exports.getRegionsHierachy = getRegionsHierachy;
