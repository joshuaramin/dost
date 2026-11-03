import { getAllHeatMapGeo } from "../controller/nlp.controller.js";
import express from "express";

const router = express.Router();

router.get("/", getAllHeatMapGeo);

export default router;
