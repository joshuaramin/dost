import {
  createEducationResources,
  getAllEducationResources,
} from "@/controller/educational-resources.controller";
import { withAuth } from "@/lib/helpers/useAuth";
import express from "./log.routes";

const router = express.Router();

router.get("/", withAuth, getAllEducationResources);
router.post("/", withAuth, createEducationResources);
router.put("/:id", withAuth);
router.patch("/:id", withAuth);

export default router;
