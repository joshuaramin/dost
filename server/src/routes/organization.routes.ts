import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/", withAuth);
router.post("/", withAuth);
router.put("/:id", withAuth);
router.patch("/:id", withAuth);

export default router;
