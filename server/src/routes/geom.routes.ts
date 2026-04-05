import { getAllRegions } from "@/controller/geom.controller";
import express from "express";

const router = express.Router();

router.get("/", getAllRegions);

export default router;
