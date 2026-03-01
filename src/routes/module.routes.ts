import express from "express";
import { createModule, getAllModule, getModuleById } from "@/controller/module.controller";
import { withAuth } from "@/lib/helpers/useAuth";

const router = express.Router();

router.get("/", withAuth, getAllModule);
router.get("/:id", withAuth, getModuleById);
router.post("/", withAuth, createModule)

export default router;
