import { getAllActivityLogs } from "@/controller/log.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/logs/:id", withAuth, getAllActivityLogs);

export default express;
