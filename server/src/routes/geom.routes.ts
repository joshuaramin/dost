import { getAllGeom, getRegions } from "@/controller/geom.controller";
import express from "express";

const router = express.Router();

router.get("/geom", getAllGeom);
router.get("/regions", getRegions);
export default router;
