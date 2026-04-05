import { getAllHeatMapGeo } from "@/controller/nlp.controller";
import express from "express";

const router = express.Router();

router.get("/", getAllHeatMapGeo);

export default router;
