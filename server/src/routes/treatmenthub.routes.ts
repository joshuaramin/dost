import { withAuth } from "@/lib/helpers/useAuth";
import express from "express";

const router = express.Router();

router.get("/");
router.get("/:id");
router.post("/", withAuth);
router.patch("/:id", withAuth);

export default express;
