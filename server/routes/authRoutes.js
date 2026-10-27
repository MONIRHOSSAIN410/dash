import { Router } from "express";
import { login, register, me } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.post("/login", login);
router.post("/register", protect, authorize("admin"), register);
router.get("/me", protect, me);
export default router;
