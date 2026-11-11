import { GetGroupedHeatMapGeo } from "../services/nlp.services.js";
export const getAllHeatMapGeo = async (request, response) => {
    try {
        const result = await GetGroupedHeatMapGeo();
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
