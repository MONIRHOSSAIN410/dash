import { Router } from "express";
import { exportExcel, exportPdf } from "../controllers/exportController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/excel", protect, exportExcel);
router.get("/pdf", protect, exportPdf);
export default router;
