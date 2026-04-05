import { Login, Logout } from "@/controller/auth.controller";
import express from "express";

const router = express.Router();

router.post("/login", Login);
router.post("/logout/:id", Logout);

export default router;
