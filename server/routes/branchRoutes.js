import { Router } from "express";
import { getBranches, createBranch } from "../controllers/branchController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.route("/").get(protect, getBranches).post(protect, authorize("admin"), createBranch);
export default router;
