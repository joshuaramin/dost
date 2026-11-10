import express from "express";
import { addSubResource, createResource, getAllResource, getResourceById, softDeleteResource, } from "../controller/resource.controller.js";
import { withAuth } from "../lib/helpers/useAuth.js";
import { withPermission } from "../lib/helpers/usePermission.js";
import { asyncHandler } from "../lib/common/middleware.ts/asyncHandler.js";
const router = express.Router();
// Get
router.get("/", withAuth, 
// withPermission("resource:read"),
asyncHandler(getAllResource));
router.get("/:id", withAuth, 
// withPermission("resource:read"),
asyncHandler(getResourceById));
//Post
router.post("/", 
// withAuth,
// withPermission("resource:create"),
asyncHandler(createResource));
//Patch
router.patch("/:id", withAuth, withPermission("resource:update"), asyncHandler(softDeleteResource));
router.patch("/addResource/:id", withAuth, withPermission("resource:update"), asyncHandler(addSubResource));
//Put
export default router;
