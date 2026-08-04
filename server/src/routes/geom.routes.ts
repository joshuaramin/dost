import express from "express";
import {
  getAllGeom,
  getRegions,
  getProvinces,
  getMunicipalities,
  getBarangays,
} from "@/controller/geom.controller";

const router = express.Router();

router.get("/geom", getAllGeom);

router.get("/regions", getRegions);

router.get("/provinces", getProvinces);

router.get("/municipalities", getMunicipalities);

router.get("/barangays", getBarangays);

export default router;
