import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  getCategories,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

export const productRouter = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
productRouter.get("/all", getProducts);
productRouter.get("/categories", getCategories);
productRouter.get("/:id", getProduct);

// ── Admin routes ──────────────────────────────────────────────────────────────
productRouter.get("/admin/all", protect, adminOnly, getAdminProducts);
productRouter.post("/create", protect, adminOnly, upload.single("image"), createProduct);
productRouter.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
productRouter.delete("/:id", protect, adminOnly, deleteProduct);