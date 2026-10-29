"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHeatMapGeo = void 0;
const nlp_services_1 = require("../services/nlp.services.js");
const getAllHeatMapGeo = async (request, response) => {
    try {
        const result = await (0, nlp_services_1.GetGroupedHeatMapGeo)();
        return response.status(200).json({
            ...result,
            timestamp: new Date(Date.now()),
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({
            message: "Internal Server Error",
            success: false,
            timestamp: new Date(Date.now()),
        });
    }
};
exports.getAllHeatMapGeo = getAllHeatMapGeo;
