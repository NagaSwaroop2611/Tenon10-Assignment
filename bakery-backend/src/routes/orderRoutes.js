import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

export const orderRouter = express.Router();

// ── Private routes (customers)
orderRouter.post("/place", protect, placeOrder);
orderRouter.get("/my-orders", protect, getMyOrders);
orderRouter.get("/:id", protect, getOrder);
orderRouter.patch("/:id/cancel", protect, cancelOrder);

// ── Admin routes 
orderRouter.get("/admin/all", protect, adminOnly, getAllOrders);
orderRouter.patch("/:id/status", protect, adminOnly, updateOrderStatus);