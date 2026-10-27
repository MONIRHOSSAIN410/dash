import { Router } from "express";
import { login, register, me } from "../controllers/authController.js";
// import { protect, authorize } from "../middleware/auth.js";

// const router = Router();
// router.post("/login", login);
// router.post("/register", protect, authorize("admin"), register);
// router.get("/me", protect, me);
// export default router;


import express from "express";
import {
  login,
  register,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;

