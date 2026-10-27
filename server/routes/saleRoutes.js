import { Router } from "express";
import { getSales, createSale, deleteSale } from "../controllers/saleController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.route("/").get(protect, getSales).post(protect, createSale);
router.delete("/:id", protect, authorize("admin"), deleteSale);
export default router;
