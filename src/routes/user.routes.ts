import { getAllUsers } from "@/controller/user.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", withAuth);

export default router;
