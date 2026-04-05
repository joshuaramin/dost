import {
  addRolePermission,
  createRoles,
  getAllRoles,
  getRoleBySlug,
  softDeleteRoles,
} from "@/controller/roles.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/", withAuth, getAllRoles);
router.post("/", withAuth, createRoles);
router.get("/:id", withAuth, getRoleBySlug);
router.patch("/:id", withAuth, softDeleteRoles);
router.put("/addRolePermission/:id", addRolePermission);

export default router;
