import {
  getAllUsers,
  getUserById,
  createUser,
  softDeleteUser,
} from "@/controller/user.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import { withPermission } from "@/lib/helpers/usePermission";

import express from "express";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", withAuth, withPermission("user", "read"), getUserById);
router.post("/", createUser);
router.patch("/:id", withAuth, softDeleteUser);

export default router;
